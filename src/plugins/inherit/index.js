const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const shareOptionValues = require('./shareOptionValues')
const addInheritance = require('./addInheritance')


module.exports = function* inherit() {
  yield preHook({
    event: 'schema',
    tags: ['modifySchema', 'modifyCommandSchema'],
  }, (schema) => {
    schema = modifySchema(schema)
    return [schema]
  })

  yield preHook({
    event: 'config',
    tags: ['modifyConfig', 'modifyCommandConfig'],
    goesAfter: ['createCommandConfig'],
    goesBefore: ['modifyConfig'],
  }, (schema, config) => {
    config = addInheritance(schema, config)
    return [schema, config]
  })

  yield preHook({
    event: 'execute',
    tags: ['modifyCommand', 'modifyOption'],
  }, (_, request) => {
    request = shareOptionValues(request)
    return [_, request]
  })
}

module.exports.tags = ['core']
