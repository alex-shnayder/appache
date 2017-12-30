const { hook, preHook, preHookStart } = require('hooter/effects')
const { InputError } = require('../../common')
const { normalizeBatchCommands, normalizeBatchOptions } = require('./normalize')


function initializeEventHandler(configResult, batch) {
  let _config = configResult.value

  if (!_config) {
    throw new Error(
        'The config must already be defined at the beginning of "execute"'
      )
  }

  if (!Array.isArray(batch) || batch.length === 0) {
    throw new InputError('A batch must be an array of commands')
  }

  this.source = this.tooter
  return [_config, batch]
}

function normalizeCommandsHandler(config, batch) {
  batch = normalizeBatchCommands(batch)
  return [config, batch]
}

function normalizeOptionsHandler(config, batch) {
  batch = normalizeBatchOptions(batch)
  return [config, batch]
}


module.exports = function* execute() {
  let config = yield hook('configure')

  yield preHookStart('execute', initializeEventHandler.bind(null, config))

  yield preHook({
    event: 'execute',
    tags: ['modifyCommand'],
    goesBefore: ['modifyCommand'],
  }, normalizeCommandsHandler)

  yield preHook({
    event: 'execute',
    tags: ['modifyOption'],
    goesBefore: ['modifyOption'],
  }, normalizeOptionsHandler)
}
