const { preHook, hookEnd } = require('hooter/effects')
const assignDefaults = require('./assignDefaults')
const validateConfig = require('./validateConfig')
const finalizeConfig = require('./finalizeConfig')


module.exports = function* config() {
  yield preHook({
    event: 'config',
    tags: ['modifyConfig', 'modifyCommandConfig', 'modifyOptionConfig'],
    goesAfter: ['owner:inherit'],
    goesBefore: ['modifyConfig'],
  }, (schema, config) => {
    config = assignDefaults(schema, config)
    return [schema, config]
  })

  yield preHook({
    event: 'config',
    tags: ['modifyConfig', 'modifyCommandConfig'],
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

module.exports.tags = ['core']
