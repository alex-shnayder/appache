const {
  next, hookStart, hookEnd, hookEndResult, toot,
} = require('hooter/effects')


module.exports = function* startPlugin() {
  let schema = yield hookEndResult('schema')
  let config

  yield hookStart('start', function* () {
    config = yield toot('config', schema.get(), {})
    return yield next(config)
  })

  yield hookEnd('start', function* (config) {
    return yield toot('activate', config)
  })
}
