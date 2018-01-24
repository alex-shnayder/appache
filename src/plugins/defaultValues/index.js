const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const addOptionsToCommand = require('./addOptionsToCommand')
const setDefaultValuesForBatch = require('./setDefaultValuesForBatch')


function schematizeHandler(schema) {
  schema = modifySchema(schema)
  return [schema]
}

function addOptionsHandler(config, batch) {
  batch = batch.map((command) => {
    return addOptionsToCommand(config, command)
  })
  return [config, batch]
}

function setDefaultValuesHandler(config, batch) {
  batch = setDefaultValuesForBatch(batch)
  return [config, batch]
}


module.exports = function* defaultValues() {
  yield preHook({
    event: 'schematize',
    tags: ['modifySchema'],
  }, schematizeHandler)

  yield preHook({
    event: 'execute',
    tags: ['addOption'],
    goesAfter: ['identifyCommand'],
  }, addOptionsHandler)

  yield preHook({
    event: 'execute',
    tags: ['modifyOption'],
    goesAfter: ['identifyOption'],
  }, setDefaultValuesHandler)
}
