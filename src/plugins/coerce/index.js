const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const coerceBatchOptions = require('./coerceBatchOptions')


function schematizeHandler(schema) {
  schema = modifySchema(schema)
  return [schema]
}

function executeHandler(config, batch) {
  batch = coerceBatchOptions(batch)
  return [config, batch]
}


module.exports = function* coerce() {
  yield preHook({
    event: 'schematize',
    tags: ['modifyOptionSchema'],
  }, schematizeHandler)

  yield preHook({
    event: 'execute',
    tags: ['modifyOption'],
  }, executeHandler)
}
