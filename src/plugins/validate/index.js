const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const validateCommand = require('./validateCommand')


module.exports = function* validate() {
  yield preHook({
    event: 'schematize',
    tags: ['modifyOptionSchema'],
  }, (schema) => {
    schema = modifySchema(schema)
    return [schema]
  })

  yield preHook({
    event: 'execute',
    goesAfter: ['modifyOption'],
    goesBefore: ['handleBatch'],
  }, (config, batch) => {
    batch.forEach((command) => {
      validateCommand(command)
    })
  })
}
