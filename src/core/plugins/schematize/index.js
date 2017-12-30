const { preHookStart, hookEnd } = require('hooter/effects')
const baseSchema = require('./schema')


function addSchemaHandler() {
  return [baseSchema]
}

function returnSchemaHandler(schema) {
  return schema
}


module.exports = function* schematize() {
  yield preHookStart('schematize', addSchemaHandler)
  yield hookEnd('schematize', returnSchemaHandler)
}
