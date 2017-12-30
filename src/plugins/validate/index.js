const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const validateCommand = require('./validateCommand')


function schematizeHandler(schema) {
  schema = modifySchema(schema)
  return [schema]
}

function executeHandler(config, batch) {
  batch.forEach((command) => {
    validateCommand(command)
  })
}


module.exports = function* validate() {
  yield preHook({
    event: 'schematize',
    tags: ['modifyOptionSchema'],
  }, schematizeHandler)

  yield preHook({
    event: 'execute',
    goesAfter: ['modifyOption'],
    goesBefore: ['handleBatch'],
  }, executeHandler)
}
