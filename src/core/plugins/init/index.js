const { preHookStart, hookEnd, toot } = require('hooter/effects')


module.exports = function* initialize() {
  yield preHookStart('initialize', function* () {
    let schema = yield toot('schematize')
    return [schema]
  })

  yield hookEnd('initialize', (schema, result) => result)
}
