const {
  next, hookStart, hookEnd, hookEndResult, call,
} = require('hooter/effects')


const NO_HANDLER = {}


function* errorStartHandler(config, err, ...args) {
  try {
    yield next(config, err, err && err.event, ...args)
  } catch (err) {
    /* eslint-disable no-console */
    yield call(console.error, err)
    yield call(process.exit, 1)
  }
}

function* errorEndHandler(config, err, ...args) {
  let result = yield next(config, err, ...args).or(NO_HANDLER)

  if (result === NO_HANDLER) {
    throw err
  }

  return result
}

module.exports = function* errorPlugin() {
  let config = yield hookEndResult('config')

  yield hookStart('error', function* (...args) {
    return yield next(config.value, ...args)
  })

  yield hookStart('error', errorStartHandler)
  yield hookEnd('error', errorEndHandler)
}
