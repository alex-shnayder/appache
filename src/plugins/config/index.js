const { preHook, hookEnd } = require('hooter/effects')
const assignDefaults = require('./assignDefaults')
const validateConfig = require('./validateConfig')
const finalizeConfig = require('./finalizeConfig')


module.exports = function* config() {
  yield preHook({
    event: 'config',
    tags: ['modifyCommandConfig', 'modifyOptionConfig'],
    goesAfter: ['owner:inherit'],
    goesBefore: ['modifyCommandConfig', 'modifyOptionConfig'],
  }, (schema, config) => {
    config = assignDefaults(schema, config)
    return [schema, config]
  })

  yield preHook({
    event: 'config',
    tags: ['modifyCommandConfig'],
    goesAfter: ['modifyConfig'],
  }, (schema, config) => {
    config = finalizeConfig(schema, config)
    return [schema, config]
  })

  yield hookEnd('config', (schema, config) => {
    validateConfig(schema, config)
    return config
  })
}
