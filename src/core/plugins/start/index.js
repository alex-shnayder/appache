const {
  hook, preHookStart, hookEnd, configure, activate,
} = require('../../effects')


function* configureHandler(schemaResult) {
  let config = yield configure(schemaResult.value, {})
  return [config]
}

function* activateHandler(config) {
  yield activate(config)
  return config
}


module.exports = function* start() {
  let schema = yield hook('schematize')

  yield preHookStart('start', configureHandler.bind(null, schema))
  yield hookEnd('start', activateHandler)
}
