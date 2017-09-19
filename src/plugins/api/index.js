const { next, hookEnd } = require('hooter/effects')


module.exports = function* apiPlugin(lifecycle) {
  yield hookEnd('init', function* (schema, result) {
    if (!result) {
      result = lifecycle
    }

    return yield next(schema, result)
  })
}
