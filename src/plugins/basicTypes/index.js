const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const processCommand = require('./processCommand')


function schematizeHandler(schema) {
  schema = modifySchema(schema)
  return [schema]
}

function executeHandler(config, batch) {
  batch = batch.map(processCommand)
  return [config, batch]
}


module.exports = function* basicTypes() {
  yield preHook({
    event: 'schematize',
    tags: ['modifySchema'],
  }, schematizeHandler)

  yield preHook({
    event: 'execute',
    tags: ['modifyOption'],
  }, executeHandler)
}
