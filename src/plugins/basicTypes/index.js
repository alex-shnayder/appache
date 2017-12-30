const { preHook } = require('hooter/effects')
const processCommand = require('./processCommand')


function handler(config, batch) {
  batch = batch.map(processCommand)
  return [config, batch]
}


module.exports = function* basicTypes() {
  yield preHook({
    event: 'execute',
    tags: ['modifyOption'],
  }, handler)
}
