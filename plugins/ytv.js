const axios = require("axios");

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("> Masukkan URL YouTube.\nContoh: .ytmp4 https://youtube.com/watch?v=xxxx");

  await m.reply("> Mohon tunggu sebentar...");

  try {
    const api = `https://hookrest.my.id/download/ytmp4?url=${encodeURIComponent(text)}`;
    const res = await axios.get(api);
    const data = res.data;

    if (!data.status || !data.result || !data.result.download) {
      return m.reply("> Gagal mengambil data video. Pastikan URL valid.");
    }

    const { title, format, quality, duration, download } = data.result;

    const caption = 
`> Judul: ${title}
> Format: ${format}p
> Kualitas: ${quality}
> Durasi: ${duration}`;

    await conn.sendMessage(m.chat, {
      video: { url: download },
      caption,
      mimetype: "video/mp4"
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply("> Terjadi kesalahan saat mengambil atau mengirim video.");
  }
};

handler.command = ["ytmp4", "ytv"];
module.exports = handler;
