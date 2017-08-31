const { next, hookStart, hookEnd } = require('hooter/effects')
const baseSchema = require('./schema')


module.exports = function* schemaPlugin() {
  yield hookStart('schema', function* () {
    return yield next(baseSchema)
  })

  yield hookEnd('schema', (schema) => schema)
}
