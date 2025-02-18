const express = require('express')
const bodyParser = require('body-parser')

const routes = require('./routes/routes')

const app = express()
app.use(express.json())

// Подключаем маршруты
app.use(routes)
app.use('*', (req, res) => {
  res.status(404).send('Страницы нет')
})

// Middleware для обработки ошибок
// app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`))
