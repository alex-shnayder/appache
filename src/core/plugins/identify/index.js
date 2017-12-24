const { preHook } = require('hooter/effects')
const { assignCommandConfigs, assignOptionConfigs } = require('./assignConfigs')


module.exports = function* identify() {
  yield preHook({
    event: 'execute',
    tags: ['identifyCommand'],
  }, (config, batch) => {
    batch = assignCommandConfigs(config, batch)
    return [config, batch]
  })

  yield preHook({
    event: 'execute',
    tags: ['identifyOption'],
  }, (config, batch) => {
    batch = assignOptionConfigs(config, batch)
    return [config, batch]
  })
}
