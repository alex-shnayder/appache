const { preHook } = require('hooter/effects')


const TAGS = ['api']


function handler(lifecycle, schema, result) {
  return [schema, result || lifecycle]
}


module.exports = function* api(lifecycle) {
  yield preHook({
    event: 'initialize',
    tags: TAGS,
    goesAfter: TAGS,
  }, handler.bind(null, lifecycle))
}

module.exports.tags = TAGS
