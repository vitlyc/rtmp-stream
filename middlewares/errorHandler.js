const errorHandler = (err, req, res, next) => {
  console.log('❌ Ошибка:', err.message)

  console.error(err.stack)
  res.status(500).send({ error: '❌ Ошибка:' + err.message })
}

module.exports = errorHandler
