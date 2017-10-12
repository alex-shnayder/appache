const { preHook, hookEnd } = require('hooter/effects')
const assignDefaults = require('./assignDefaults')
const validateConfig = require('./validateConfig')
const finalizeConfig = require('./finalizeConfig')


module.exports = function* config() {
  yield preHook('config', (schema, config) => {
    config = assignDefaults(schema, config)
    return [schema, config]
  })

  yield hookEnd('config', (schema, config) => {
    config = finalizeConfig(schema, config)
    validateConfig(schema, config)
    return config
  })
}

module.exports.tags = ['core']
