const { preHookStart, hookEnd } = require('hooter/effects')
const baseSchema = require('./schema')


module.exports = function* schemaPlugin() {
  yield preHookStart('schema', () => [baseSchema])
  yield hookEnd('schema', (schema) => schema)
}

module.exports.tags = ['core']
