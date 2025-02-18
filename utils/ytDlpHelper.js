const { spawn, exec } = require('child_process')
const ytDlpConfig = require('../config/yt-dlpConfig')

const startYtDlpProcess = (videoUrl, startTime) => {
  return spawn(
    'yt-dlp',
    [...ytDlpConfig, videoUrl],
    // [...ytDlpConfig, videoUrl, `--download-sections *${startTime}-inf`],

    {
      stdio: ['ignore', 'pipe', 'ignore'], // Передаем поток в ffmpeg
    }
  )
}

const stopYtDlpProcess = (ytProcess) => {
  console.log('stopYtDlpProcess')
  exec(`taskkill /IM yt-dlp.exe /T /F`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Ошибка: ${error.message}`)
      return
    }
    console.log(`❌ yt-dlp: Все процессы остановлены`)
  })
}

module.exports = { startYtDlpProcess, stopYtDlpProcess }

//* yt-dlp поддерживает возможность загрузки видео с определённого таймкода, и для этого можно использовать параметр --postprocessor-args с опцией -ss, который задаёт начало скачивания видео с указанного времени.
//* return spawn('yt-dlp', [
//*   videoUrl,
//*   '--postprocessor-args',
// *  `-ss ${startTime}`, // Указываем таймкод начала (например, 00:01:30 для 1 минуты 30 секунд)
//* ], {
//*   stdio: ['ignore', 'pipe', 'ignore'],
//* })
//* В данном случае, при запуске yt-dlp с указанным параметром, видео будет загружаться с указанного таймкода. После этого, можно передавать полученный поток в ffmpeg для стриминга.
//* Важно: в данном случае, если указать таймкод, то в ffmpeg нужно добавить параметр -copyts, чтобы сохранить тайминги потока. В противном случае, ffmpeg будет считать, что начало видео - это начало стрима, и тайминги будут сбиты.
//* streamProcess = ffmpeg(ytProcess.stdout)
//*   .inputOptions('-re', '-copyts')
//*   .outputOptions(ffmpegConfig)
//*   .output(rtmpsUrl)
//*   .on('start', () => {
//*     console.log('✅ Стрим запущен')
//*     res.send('✅ Стрим запущен')
//*   })
//*   .on('error', (err) => {
//*     console.error('❌ Ошибка ffmpeg:', err.message)
//*     streamProcess = null
//*     ytProcess = null
//*   })
//*   .on('end', () => {
//*     console.log('⏹️ Трансляция завершена')
//*     streamProcess = null
//*     ytProcess = null
//*   })
//*   .on('stderr', (stderr) => {
//*     // console.log(stderr)
//*   })
//*   .run()
//* В данном случае, ffmpeg будет использовать параметр -copyts для сохранения таймингов потока, и таймкод начала видео будет совпадать с указанным таймкодом в yt-dlp.
//* Таким образом, можно загружать видео с определённого таймкода и стримить его на сервер.

//* Работает таймкод но много лишнего
//[
//   '-f',
//   'best',
//   '--geo-bypass',
//   '--live-from-start',
//   '--no-part',
//   '--external-downloader',
//   'ffmpeg',
//   '--external-downloader-args',
//   `ffmpeg_i:-ss ${startTime}`,
//   '-o',
//   '-',
//   videoUrl,
// ],
