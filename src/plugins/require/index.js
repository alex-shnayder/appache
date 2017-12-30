const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const normalizeConfig = require('./normalizeConfig')
const validateCommand = require('./validateCommand')


function schematizeHandler(schema) {
  schema = modifySchema(schema)
  return [schema]
}

function configureHandler(schema, config) {
  config = normalizeConfig(config)
  return [schema, config]
}

function executeHandler(config, batch) {
  batch.forEach((command) => {
    validateCommand(config, command)
  })
}


module.exports = function* require() {
  yield preHook({
    event: 'schematize',
    tags: ['modifyOptionSchema'],
  }, schematizeHandler)

  yield preHook({
    event: 'configure',
    tags: ['modifyCommandConfig'],
    goesAfter: ['modifyCommandConfig'],
  }, configureHandler)

  yield preHook({
    event: 'execute',
    goesAfter: ['modifyOption'],
    goesBefore: ['handleBatch'],
  }, executeHandler)
}
