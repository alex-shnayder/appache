const { preHookEnd } = require('hooter/effects')


module.exports = function* apiPlugin(lifecycle) {
  yield preHookEnd('init', (schema, result) => [schema, result || lifecycle])
}

module.exports.tags = ['api']
