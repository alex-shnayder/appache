const { preHookStart, hookEnd, toot } = require('hooter/effects')


module.exports = function* initPlugin() {
  yield preHookStart('init', function* () {
    let schema = yield toot('schema')
    return [schema]
  })

  yield hookEnd('init', (schema, result) => result)
}

module.exports.tags = ['core']
