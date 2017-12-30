const { preHook, hookEnd } = require('hooter/effects')
const assignDefaults = require('./assignDefaults')
const validateConfig = require('./validateConfig')
const finalizeConfig = require('./finalizeConfig')


function defaultsHandler(schema, config) {
  config = assignDefaults(schema, config)
  return [schema, config]
}

function finalizeConfigHandler(schema, config) {
  config = finalizeConfig(schema, config)
  return [schema, config]
}

function validateConfigHandler(schema, config) {
  validateConfig(schema, config)
  return config
}


module.exports = function* configure() {
  yield preHook({
    event: 'configure',
    tags: ['modifyCommandConfig', 'modifyOptionConfig'],
    goesAfter: ['owner:inherit'],
    goesBefore: ['modifyCommandConfig', 'modifyOptionConfig'],
  }, defaultsHandler)

  yield preHook({
    event: 'configure',
    tags: ['modifyCommandConfig', 'modifyOptionConfig'],
    goesAfter: ['modifyConfig'],
  }, finalizeConfigHandler)

  yield hookEnd('configure', validateConfigHandler)
}
