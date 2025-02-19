const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')
const fs = require('fs')
const path = '../userdata.json'
// Токен  бота
const token = '7848450425:AAG1N4hrc7xHX9U-KQmq1tAPd915_43kdB0'

const bot = new TelegramBot(token, { polling: true })
const PORT = 3000
const URL = `http://localhost:${PORT}`
const MY_ID = 125897751
//Меню команд для бота
const commands = [
  {
    command: 'start',
    description: 'Запуск бота',
  },
  {
    command: 'stop',
    description: 'Остановить стрим',
  },
]
bot.setMyCommands(commands)

// Объект для хранения данных пользователя
const userData = {}
// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id

  if (msg.from.id != MY_ID) return

  bot
    .sendMessage(chatId, 'Привет! Давайте настроим потоковую трансляцию.')
    .then(() => {
      startConfigFlow(chatId)
    })
})
// Команда /stop
bot.onText(/\/stop/, async (msg) => {
  const chatId = msg.chat.id

  // Отановка стрима
  try {
    const response = await fetch(`${URL}/stop`)
    const data = await response.text()
    bot.sendMessage(chatId, data)
  } catch (error) {
    bot.sendMessage(chatId, 'Ошибка при остановке стрима: ' + error.message)
  }
})

// Функция начала настройки
function startConfigFlow(chatId) {
  userData[chatId] = {
    step: 'awaitingServerUrl',
    serverUrl: null,
    streamKey: null,
  }
  bot.sendMessage(chatId, 'Пожалуйста, введите server URL:')
}

// Функция сохранения данных
function saveUserData(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2))
}
async function startStream(url, chatId) {
  console.log('Запуск стрима с URL:', url)
  try {
    const response = await fetch(`${URL}/stream?url=${url}`)
    const data = await response.text()
    bot.sendMessage(chatId, data)
  } catch (error) {
    bot.sendMessage(chatId, 'Ошибка при запуске стрима: ' + error.message)
  }
}
// Обработчик текстовых сообщений
bot.on('message', (msg) => {
  const chatId = msg.chat.id
  const text = msg.text.trim()

  if (/https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/.test(text)) {
    return startStream(text, chatId)
  }

  if (!userData[chatId]) return

  if (userData[chatId].step === 'awaitingServerUrl') {
    userData[chatId].serverUrl = text
    userData[chatId].step = 'awaitingStreamKey'
    bot.sendMessage(chatId, 'Теперь введите stream key:')
  } else if (userData[chatId].step === 'awaitingStreamKey') {
    userData[chatId].streamKey = text
    userData[chatId].step = ''
    bot.sendMessage(chatId, 'Настройка завершена! 🎉')
    console.log(`Пользователь ${chatId} настроил:
      Server URL: ${userData[chatId].serverUrl}
      Stream Key: ${userData[chatId].streamKey}`)

    saveUserData(userData[chatId])
    delete userData[chatId]
  }
})
