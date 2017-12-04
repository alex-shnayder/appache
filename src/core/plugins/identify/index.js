const { preHook, preHookStart, hook, hookEnd } = require('hooter/effects')
const assignConfigs = require('./assignConfigs')


module.exports = function* identify() {
  let config = yield hook('config')

  yield preHookStart('identify', function(batch) {
    let _config = config.value

    if (!_config) {
      throw new Error(
        'The config must already be defined at the beginning of "identify"'
      )
    }

    this.source = this.tooter
    return [_config, batch]
  })

  yield preHook({
    event: 'identify',
    tags: ['assignCommandConfig', 'assignOptionConfig'],
  }, (config, batch) => {
    batch = assignConfigs(config, batch)
    return [config, batch]
  })

  yield hookEnd('identify', (config, batch) => batch)
}
