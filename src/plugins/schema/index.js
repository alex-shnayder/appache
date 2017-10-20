const { preHookStart, hookEnd } = require('hooter/effects')
const baseSchema = require('./schema')


module.exports = function* schema() {
  yield preHookStart('schema', () => [baseSchema])
  yield hookEnd('schema', (schema) => schema)
}
