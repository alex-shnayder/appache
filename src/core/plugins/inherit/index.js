const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const addInheritance = require('./addInheritance')


function schematizeHandler(schema) {
  schema = modifySchema(schema)
  return [schema]
}

function configureHandler(schema, config) {
  config = addInheritance(schema, config)
  return [schema, config]
}


module.exports = function* inherit() {
  yield preHook({
    event: 'schematize',
    tags: ['modifyCommandSchema'],
  }, schematizeHandler)

  yield preHook({
    event: 'configure',
    tags: ['modifyCommandConfig'],
    goesBefore: ['modifyCommandConfig'],
  }, configureHandler)
}
