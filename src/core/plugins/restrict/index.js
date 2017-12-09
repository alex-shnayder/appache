const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const validateBatch = require('./validateBatch')


module.exports = function* restrict() {
  yield preHook({
    event: 'schematize',
    tags: ['modifyCommandSchema'],
  }, (schema) => {
    schema = modifySchema(schema)
    return [schema]
  })

  yield preHook({
    event: 'execute',
    goesAfter: ['identify'],
    goesBefore: ['process'],
  }, validateBatch)
}
