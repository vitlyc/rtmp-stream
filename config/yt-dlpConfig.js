module.exports = [
  '-f',
  'bestvideo[height<=720]+bestaudio/best[height<=720]',
  '-o',
  '-',
  '--no-part',
  '--buffer-size',
  '16M',
  '--print-json',
]
//
