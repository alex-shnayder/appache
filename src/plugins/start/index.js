const {
  hook, preHookStart, hookEnd, toot,
} = require('hooter/effects')


module.exports = function* startPlugin() {
  let schema = yield hook('schema')
  let config

  yield preHookStart('start', function* () {
    config = yield toot('config', schema.value, {})
    return [config]
  })

  yield hookEnd('start', function* (config) {
    return yield toot('activate', config)
  })
}

module.exports.tags = ['core']
