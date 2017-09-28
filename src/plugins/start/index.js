const {
  next, hookStart, hookEnd, hookResult, toot,
} = require('hooter/effects')


module.exports = function* startPlugin() {
  let schema = yield hookResult('schema')
  let config

  yield hookStart('start', function* () {
    config = yield toot('config', schema.value, {})
    return yield next(config)
  })

  yield hookEnd('start', function* (config) {
    return yield toot('activate', config)
  })
}
