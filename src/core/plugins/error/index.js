const {
  next, hook, hookStart, hookEnd, preHookStart, call,
} = require('hooter/effects')


const NO_HANDLER = {}


function initializeArgsHandler(configResult, ...args) {
  return [configResult.value, ...args]
}

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

module.exports = function* error() {
  let config = yield hook('configure')

  yield preHookStart('error', initializeArgsHandler.bind(null, config))
  yield hookStart('error', errorStartHandler)
  yield hookEnd('error', errorEndHandler)
}
