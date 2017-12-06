const { preHookStart, hookEnd } = require('hooter/effects')
const baseSchema = require('./schema')


module.exports = function* schema() {
  yield preHookStart('schematize', () => [baseSchema])
  yield hookEnd('schematize', (schema) => schema)
}
