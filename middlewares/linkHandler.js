const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch (err) {
    return false
  }
}

exports.linkHandler = (req, res, next) => {
  const videoUrl = req.query.url

  if (!videoUrl || !isValidUrl(videoUrl)) {
    return res.status(400).send('❗ Укажите корректный URL')
  }

  const startTimeMatch = videoUrl.match(/\?t=(\d+)/)
  const startTime = startTimeMatch ? parseInt(startTimeMatch[1], 10) : 0

  req.videoUrl = videoUrl
  req.startTime = startTime

  next()
}
