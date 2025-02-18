let streamProcess = null
let ytProcess = null

const setStreamProcess = (process) => {
  streamProcess = process
}

const getStreamProcess = () => {
  return streamProcess
}

const setYtProcess = (process) => {
  ytProcess = process
}

const getYtProcess = () => {
  return ytProcess
}

module.exports = {
  setStreamProcess,
  getStreamProcess,
  setYtProcess,
  getYtProcess,
}
