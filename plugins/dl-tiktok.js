/*
  fitur = tiktok
  api = hookrest.my.id
  code by = Danz
  desk = download video TikTok tanpa watermark
*/

const axios = require("axios");

let handler = async (m, { conn, text, reply }) => {
  if (!text) return reply("> Masukkan URL TikTok.\n> Contoh: .tiktok https://vt.tiktok.com/abc123");

  await conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

  try {
    const api = `https://hookrest.my.id/download/tiktok?url=${encodeURIComponent(text)}`;
    const { data } = await axios.get(api);

    if (!data.status || !data.result || !data.result.play) {
      return reply("> Gagal mengambil video. Pastikan link TikTok valid.");
    }

    const { result } = data;
    const {
      play,
      author,
      stats,
      duration,
      id
    } = result;

    const caption = `
> 🧾 ID: ${id}
> 👤 Author: ${author.nickname} (@${author.unique_id})
> ⏱ Durasi: ${duration}s
> ❤️ ${stats.digg_count} 💬 ${stats.comment_count} 🔁 ${stats.share_count}
`.trim();

    await conn.sendMessage(m.chat, {
      video: { url: play },
      caption,
      mimetype: 'video/mp4'
    }, { quoted: m });

  } catch (err) {
    console.error("TikTok Error:", err);
    reply("> Terjadi kesalahan saat mengambil video TikTok.");
  }
};

handler.command = ["tiktok", "tt"];
module.exports = handler;
