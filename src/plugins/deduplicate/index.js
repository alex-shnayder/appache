const { preHook } = require('hooter/effects')
const removeDuplicateOptions = require('./removeDuplicateOptions')


function executeHandler(config, batch) {
  batch = removeDuplicateOptions(batch)
  return [config, batch]
}


module.exports = function* deduplicate() {
  yield preHook({
    event: 'execute',
    tags: ['removeOption'],
    goesAfter: ['identifyOption'],
  }, executeHandler)
}
