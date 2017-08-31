const { next, hookStart, hookEnd, toot } = require('hooter/effects')


module.exports = function* initPlugin() {
  yield hookStart('init', function* () {
    let schema = yield toot('schema')
    return yield next(schema)
  })

  yield hookEnd('init', (schema, result) => result)
}
