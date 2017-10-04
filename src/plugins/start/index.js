const {
  preHookStart, hookEnd, hookResult, toot,
} = require('hooter/effects')


module.exports = function* startPlugin() {
  let schema = yield hookResult('schema')
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
