const {
  getStreamProcess,
  getYtProcess,
  setStreamProcess,
  setYtProcess,
} = require('../utils/processManager')

const { stopYtDlpProcess } = require('../utils/ytDlpHelper')

exports.stopStream = (req, res, next) => {
  const streamProcess = getStreamProcess()
  const ytProcess = getYtProcess()

  if (!streamProcess || !ytProcess) {
    return res.send('❗ Трансляция не запущена')
  }

  streamProcess.kill('SIGINT')
  setStreamProcess(null)

  stopYtDlpProcess()
  setYtProcess(null)

  console.log('⏹️ Трансляция остановлена')
  res.send('⏹️ Трансляция остановлена')
}
