const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
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
}
