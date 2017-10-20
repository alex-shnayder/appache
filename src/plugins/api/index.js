const { preHook } = require('hooter/effects')


const TAGS = ['api']

module.exports = function* api(lifecycle) {
  yield preHook({
    event: 'init',
    tags: TAGS,
    goesAfter: TAGS,
  }, (schema, result) => [schema, result || lifecycle])
}

module.exports.tags = TAGS
