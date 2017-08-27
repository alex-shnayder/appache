const { next, hook, hookEnd } = require('hooter/effects')
const assignDefaults = require('./assignDefaults')
const validateConfig = require('./validateConfig')


module.exports = function* configPlugin() {
  yield hook('config', function* (schema, config) {
    config = assignDefaults(schema, config)
    return yield next(schema, config)
  })

  yield hookEnd('config', (schema, config) => {
    validateConfig(schema, config)
    return config
  })
}
