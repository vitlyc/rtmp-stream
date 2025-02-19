const fs = require('fs')
const path = require('path')

// Вспомогательная функция для чтения JSON
function readJSON(filePath) {
  try {
    const absolutePath = path.resolve(__dirname, filePath)
    const data = fs.readFileSync(absolutePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Ошибка при чтении файла userdata.json:', error.message)
    return null
  }
}

const userDataPath = '../userdata.json'

const userData = readJSON(userDataPath)

const rtmpsUrl = userData.serverUrl + userData.streamKey
console.log('rtmpsUrl:', rtmpsUrl)

module.exports = { rtmpsUrl }
