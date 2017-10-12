const { preHook, preHookStart } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const shareOptionValues = require('./shareOptionValues')
const addInheritance = require('./addInheritance')


module.exports = function* inherit() {
  yield preHook('schema', (schema) => {
    schema = modifySchema(schema)
    return [schema]
  })

  yield preHookStart('config', (schema, config) => {
    config = addInheritance(schema, config)
    return [schema, config]
  })

  yield preHook('execute', (_, request) => {
    request = shareOptionValues(request)
    return [_, request]
  })
}

module.exports.tags = ['core']
