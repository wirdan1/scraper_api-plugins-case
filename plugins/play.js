/*
  fitur = play
  api = hookrest.my.id
  code by = Danz
  desk = download video berdasarkan judul, format mp4 resolusi 720p
  *note =* wajib install ffmpeg
  sumber = https://whatsapp.com/channel/0029Vb5CxIfAjPXInV7XWz38
*/

const fs = require("fs");
const path = require("path");
const { tmpdir } = require("os");
const axios = require("axios");
const fetch = require("node-fetch");
const { execSync } = require("child_process");

let handler = async (m, { conn, args, reply }) => {
  if (!args[0]) return reply("> Masukkan judul lagu atau video yang ingin dicari.\n> Contoh: .play menepi");

  const query = encodeURIComponent(args.join(" "));
  const apiUrl = `https://hookrest.my.id/download/play?q=${query}&format=720p`;

  await conn.sendMessage(m.chat, { react: { text: "🎵", key: m.key } });

  try {
    const res = await fetch(apiUrl);
    const json = await res.json();

    if (!json.status || !json.result?.url) return reply("> Gagal mengambil data dari server. Coba dengan kata kunci lain.");

    const { filename, url, chosenFormat } = json.result;

    reply(`> Sedang memproses permintaan mu tuan`);

    // Simpan sementara di direktori tmp
    const originalName = filename.replace(/[^\w.\-]/g, "_");
    const tempFile = path.join(tmpdir(), originalName);

    const response = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(tempFile, response.data);

    // Perbaiki file video agar kompatibel
    const fixedFile = tempFile.replace(".mp4", "_fixed.mp4");
    execSync(`ffmpeg -i "${tempFile}" -c copy -movflags faststart "${fixedFile}"`);

    // Kirim ke user
    await conn.sendMessage(m.chat, {
      video: { url: fixedFile },
      mimetype: 'video/mp4',
      fileName: filename,
      caption: `> Judul: ${filename}\n> Format: ${chosenFormat}`
    }, { quoted: m });

    // Tidak menghapus file
  } catch (e) {
    console.error(e);
    reply("> Terjadi kesalahan saat mengambil video. Silakan coba beberapa saat lagi.");
  }
};

handler.command = ["play"];
module.exports = handler;
