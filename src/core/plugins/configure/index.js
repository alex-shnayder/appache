const { preHook, hookEnd } = require('hooter/effects')
const assignDefaults = require('./assignDefaults')
const validateConfig = require('./validateConfig')
const finalizeConfig = require('./finalizeConfig')


module.exports = function* configure() {
  yield preHook({
    event: 'configure',
    tags: ['modifyCommandConfig', 'modifyOptionConfig'],
    goesAfter: ['owner:inherit'],
    goesBefore: ['modifyCommandConfig', 'modifyOptionConfig'],
  }, (schema, config) => {
    config = assignDefaults(schema, config)
    return [schema, config]
  })

  yield preHook({
    event: 'configure',
    tags: ['modifyCommandConfig', 'modifyOptionConfig'],
    goesAfter: ['modifyConfig'],
  }, (schema, config) => {
    config = finalizeConfig(schema, config)
    return [schema, config]
  })

  yield hookEnd('configure', (schema, config) => {
    validateConfig(schema, config)
    return config
  })
}
