const { next, hookStart, hookEnd, hookAfter, toot } = require('hooter/effects')


module.exports = function* configPlugin() {
  let schema, config

  yield hookAfter('schema', (_schema) => {
    schema = _schema
    return schema
  })

  yield hookStart('start', function* () {
    config = yield toot('config', schema, {})
    return yield next(config)
  })

  yield hookEnd('start', function* (config) {
    return yield toot('activate', config)
  })
}
