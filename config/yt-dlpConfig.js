module.exports = [
  '-f',
  'bestvideo[height<=1080]+bestaudio/best[height<=1080]',
  // 'bestvideo[height<=1080]+bestaudio/best[height<=1080]', //транслирует видео в 1080p
  '-o',
  '-',
  '--no-part',
  '--buffer-size',
  '16M',
  '--print-json', // Добавляем параметр для вывода сведений о видео в формате JSON
]
