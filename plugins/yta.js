const axios = require("axios");

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("> Masukkan URL YouTube.\nContoh: .yta https://youtube.com/watch?v=xxxx");

  await m.reply("> Mohon tunggu sebentar...");

  try {
    const api = `https://hookrest.my.id/download/ytmp3?url=${encodeURIComponent(text)}`;
    const res = await axios.get(api);
    const data = res.data;

    if (!data.status || !data.result || !data.result.download) {
      return m.reply("> Gagal mengambil data audio. Pastikan URL benar.");
    }

    const { title, format, quality, duration, download } = data.result;

    await conn.sendMessage(m.chat, {
      audio: { url: download },
      mimetype: "audio/mpeg",
      fileName: `${title}.mp3`,
      ptt: false // ubah ke true jika ingin dijadikan VN
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply("> Terjadi kesalahan saat mengambil atau mengirim audio.");
  }
};

handler.command = ["yta", "ytmp3"];
module.exports = handler;
