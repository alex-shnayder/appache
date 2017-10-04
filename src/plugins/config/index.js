const { preHook, hookEnd } = require('hooter/effects')
const assignDefaults = require('./assignDefaults')
const validateConfig = require('./validateConfig')


module.exports = function* configPlugin() {
  yield preHook('config', (schema, config) => {
    config = assignDefaults(schema, config)
    return [schema, config]
  })

  yield hookEnd('config', (schema, config) => {
    validateConfig(schema, config)
    return config
  })
}

module.exports.tags = ['core']
