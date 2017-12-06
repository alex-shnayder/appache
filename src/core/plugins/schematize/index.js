const { preHookStart, hookEnd } = require('hooter/effects')
const baseSchema = require('./schema')


module.exports = function* schematize() {
  yield preHookStart('schematize', () => [baseSchema])
  yield hookEnd('schematize', (schema) => schema)
}
