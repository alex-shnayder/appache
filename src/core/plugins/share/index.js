const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const shareOptions = require('./shareOptions')


function schematizeHandler(schema) {
  schema = modifySchema(schema)
  return [schema]
}

function executeHandler(config, batch) {
  batch = shareOptions(batch)
  return [config, batch]
}


module.exports = function* share() {
  yield preHook({
    event: 'schematize',
    tags: ['modifyCommandSchema'],
  }, schematizeHandler)

  yield preHook({
    event: 'execute',
    tags: ['modifyCommand', 'modifyOption'],
    goesAfter: ['identifyOption'],
  }, executeHandler)
}
