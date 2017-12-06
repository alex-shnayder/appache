const { preHookStart, hookEnd, schematize } = require('../../effects')


module.exports = function* initialize() {
  yield preHookStart('initialize', function* () {
    let schema = yield schematize()
    return [schema]
  })

  yield hookEnd('initialize', (schema, result) => result)
}
