const { preHook } = require('hooter/effects')
const { assignCommandConfigs, assignOptionConfigs } = require('./assignConfigs')


function identifyCommandsHandler(config, batch) {
  batch = assignCommandConfigs(config, batch)
  return [config, batch]
}

function identifyOptionsHandler(config, batch) {
  batch = assignOptionConfigs(config, batch)
  return [config, batch]
}


module.exports = function* identify() {
  yield preHook({
    event: 'execute',
    tags: ['identifyCommand'],
  }, identifyCommandsHandler)

  yield preHook({
    event: 'execute',
    tags: ['identifyOption'],
  }, identifyOptionsHandler)
}
