const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const shareOptionValues = require('./shareOptionValues')
const addInheritance = require('./addInheritance')


module.exports = function* inherit() {
  yield preHook({
    event: 'schematize',
    tags: ['modifyCommandSchema'],
  }, (schema) => {
    schema = modifySchema(schema)
    return [schema]
  })

  yield preHook({
    event: 'configure',
    tags: ['modifyCommandConfig'],
    goesBefore: ['modifyCommandConfig'],
  }, (schema, config) => {
    config = addInheritance(schema, config)
    return [schema, config]
  })

  yield preHook({
    event: 'execute',
    tags: ['modifyCommand', 'modifyOption'],
  }, (_, batch) => {
    batch = shareOptionValues(batch)
    return [_, batch]
  })
}
