export function formatRp(value) {
  return 'Rp ' + Number(value).toLocaleString('id-ID')
}

export function youtubeEmbed(url) {
  const m = String(url || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : null
}
