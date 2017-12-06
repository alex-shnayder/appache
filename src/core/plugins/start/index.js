const {
  hook, preHookStart, hookEnd, configure, activate,
} = require('../../effects')


module.exports = function* start() {
  let schema = yield hook('schematize')
  let config

  yield preHookStart('start', function* () {
    config = yield configure(schema.value, {})
    return [config]
  })

  yield hookEnd('start', function* (config) {
    yield activate(config)
    return config
  })
}
