const { next, hook, hookStart, hookEnd, tootWith } = require('hooter/effects')
const assignDefaults = require('./assignDefaults')
const validateConfig = require('./validateConfig')


module.exports = function* configPlugin() {
  let schema, config

  yield hookEnd('schema', (_schema) => {
    schema = _schema
    return _schema
  })

  yield hookStart('start', function* () {
    config = yield tootWith('config', (_schema, _config) => {
      validateConfig(_schema, _config)
      return _config
    }, schema, {})

    return yield next(config)
  })

  yield hook('config', function* (_schema, _config) {
    _config = assignDefaults(_schema, _config)
    return yield next(_schema, _config)
  })


  yield hookStart('execute', function* (request) {
    if (!config) {
      throw new Error(
        'The config must already be defined at the beginning of "execute"'
      )
    }

    return yield next(config, request)
  })

  yield hookStart('error', function* (...args) {
    return yield next(config, ...args)
  })
}
