const { startYtDlpProcess } = require('../utils/ytDlpHelper')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegConfig = require('../config/ffmpegConfig')
const path = require('path')
const {
  setStreamProcess,
  setYtProcess,
  getStreamProcess,
} = require('../utils/processManager')

const { rtmpsUrl } = require('../utils/readJSON')

const logoPath = path.join(__dirname, '../logo.png')
// const rtmpsUrl = process.env.RTMPS_URL

exports.startStream = (req, res, next) => {
  const videoUrl = req.videoUrl
  const startTime = req.startTime // Время начала видео

  if (!videoUrl) {
    return res.status(400).send('❗ Укажите ссылку на видео')
  }
  if (getStreamProcess()) {
    return res.send('❗ Трансляция уже запущена')
  }
  console.log(`🔗 Получение видео: ${videoUrl}`)

  // Запускаем процесс yt-dlp для загрузки видео
  ytProcess = startYtDlpProcess(videoUrl, startTime)
  setYtProcess(ytProcess)
  // Обработка событий yt-dlp
  ytProcess.on('exit', (code, signal) => {
    console.log(`❌ yt-dlp: exit с кодом ${code} и сигналом ${signal}`)
    setYtProcess(null)
  })

  ytProcess.on('close', (code, signal) => {
    console.log(`🆗 yt-dlp: close с кодом ${code} и сигналом ${signal}`)
    setYtProcess(null)
  })

  ytProcess.stdout.once('data', () => {
    console.log('✅ Загрузка видео началась')
  })

  // Запускаем стрим с картинкой
  // streamLogoProcess = ffmpeg()
  //   .input(logoPath)
  //   .inputOptions(['-loop 1', '-re']) // Зацикливаем картинку
  //   .outputOptions(ffmpegConfig)
  //   .output(rtmpsUrl)
  //   .on('start', () => {
  //     console.log('✅ Стрим картинки запущен')
  //
  //   })
  //   .on('error', (err) => {
  //     console.error('❌ ffmpeg:', err.message)
  //   })
  //   .on('end', () => {
  //     console.log('⏹️ Трансляция картинки завершена')
  //   })
  //   .on('stderr', (stderr) => {
  //     console.log('stderr:', stderr) // Вывод stderr для отладки
  //   })
  //   .run()

  // Когда данные для видео начинают поступать, переключаемся на стрим с видео
  // ytProcess.stdout.once('data', () => {
  //   console.log('✅ Загрузка видео началась, переключаемся на стрим с видео')
  // Останавливаем стрим с картинкой
  //   if (streamLogoProcess) {
  //     streamLogoProcess.kill('SIGKILL') // Мягкое завершение

  //   }

  // Запускаем стрим с видео после завершения стрима картинки
  streamProcess = ffmpeg(ytProcess.stdout)
    .inputOptions(['-re'])
    .outputOptions(ffmpegConfig)
    .output(rtmpsUrl)
    .on('start', () => {
      res.send('✅ Стрим запущен')
      console.log('✅ Стрим запущен')
    })
    .on('error', (err) => {
      console.error('❌ ffmpeg:', err.message)
      setStreamProcess(null)
      setYtProcess(null) // Останавливаем yt-dlp, если ffmpeg завершился с ошибкой
    })
    .on('end', () => {
      console.log('🆗 Трансляция завершена')
      setStreamProcess(null)
      setYtProcess(null) // Останавливаем yt-dlp, если ffmpeg завершился с ошибкой
    })
    .once('progress', (progress) => {
      console.log('✅ Трансляция началась')
    })
    .run()

  setStreamProcess(streamProcess)
}
