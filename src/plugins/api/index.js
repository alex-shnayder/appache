const { preHookEnd } = require('hooter/effects')


const TAGS = ['api']

module.exports = function* api(lifecycle) {
  yield preHookEnd({
    event: 'init',
    tags: TAGS,
  }, (schema, result) => [schema, result || lifecycle])
}

module.exports.tags = TAGS
