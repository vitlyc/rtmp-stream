const { startYtDlpProcess } = require('../utils/ytDlpHelper')
const ffmpeg = require('fluent-ffmpeg')
const ffmpegConfig = require('../config/ffmpegConfig')
const path = require('path')
const {
  setStreamProcess,
  setYtProcess,
  getStreamProcess,
  getYtProcess,
} = require('../utils/processManager')
const { start } = require('repl')

let streamLogoProcess = null
let streamProcess = getStreamProcess()
let ytProcess = getYtProcess()

const watermarkPath = path.join(__dirname, '../watermark.png')
const logoPath = path.join(__dirname, '../logo.png')
const rtmpsUrl = process.env.RTMPS_URL

exports.startStream = (req, res, next) => {
  const videoUrl = req.videoUrl
  const startTime = req.startTime //добавляем время начала видео
  console.log('startTime:', startTime)

  if (!videoUrl) {
    return res.status(400).send('❗ Укажите после ?url= ссылку на видео')
  }
  if (streamProcess) {
    return res.send('❗ Трансляция уже запущена')
  }

  console.log(`🔗 Получение видео: ${videoUrl}`)

  //* получение доступных форматов видео перед загрузкой
  //* можно добавить стрим картинки перед или вместо видео
  //* добавление watermark снизу код - снизу код

  // Запускаем поток yt-dlp и передаем его в ffmpeg
  ytProcess = startYtDlpProcess(videoUrl, startTime)

  ytProcess.on('exit', (code, signal) => {
    console.log(`❌ yt-dlp: exit`)
    //Срабатывает при заверешнии и остановке процесса
  })
  ytProcess.on('close', (code, signal) => {
    console.log(`🆗 yt-dlp: close`)
    //Срабатывает при заверешнии процесса
  })
  //*  ytProcess.stdout.once запускается один раз
  ytProcess.stdout.once('data', (data) => {
    console.log('✅ Загрузка видео...')
  })
  streamLogoProcess = ffmpeg()
    .input(logoPath)
    .inputOptions(['-loop 1']) // Зацикливаем картинку
    .outputOptions(ffmpegConfig)
    .output(rtmpsUrl)
    .on('start', () => {
      console.log('✅ Стрим картинки запущен')
    })
    .on('error', (err) => {
      console.error('❌ Ошибка ffmpeg:', err.message)
      streamProcess = null
    })
    .on('end', () => {
      console.log('⏹️ Трансляция картинки завершена')
      streamProcess = null
    })
    .on('stderr', (stderr) => {
      console.log('stderr:', stderr) // Вывод stderr для отладки
    })
    .run()

  streamProcess = ffmpeg(ytProcess.stdout)
    .inputOptions('-re')
    .outputOptions(ffmpegConfig)
    .output(rtmpsUrl)
    .on('start', () => {
      res.send('✅ Стрим запущен')
      console.log('✅ Стрим запущен')
    })
    .on('error', (err) => {
      console.error('❌ ffmpeg:', err.message)
      streamProcess = null
      ytProcess = null
    })
    .on('end', () => {
      console.log('🆗 Трансляция завершена')
      streamProcess = null
      ytProcess = null
    })
    // .on('stderr', (stderr) => {
    //   console.log('stderr:', stderr) // Статистика трансляции
    // })
    .once('progress', (progress) => {
      console.log('✅ Трансляция началась')
      streamLogoProcess.kill('SIGINT')
    })
    .run()

  setYtProcess(ytProcess)
  setStreamProcess(streamProcess)
}
