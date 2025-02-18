const express = require('express')
const { startStream } = require('../controllers/startController')
const { stopStream } = require('../controllers/stopController')
const { linkHandler } = require('../middlewares/linkHandler')

const router = express.Router()

// Используем query-параметры
router.get('/stream', linkHandler, startStream)
router.get('/stop', stopStream)

module.exports = router
