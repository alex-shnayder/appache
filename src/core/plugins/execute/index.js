const {
  next, toot, hook, hookEnd, preHook, preHookStart,
} = require('hooter/effects')
const { Result } = require('../../common')
const normalizeBatch = require('./normalizeBatch')
const assignConfigs = require('./assignConfigs')


function* process(config, batch) {
  let processEvent = {
    name: 'process',
    cb: (_, command) => command,
    source: this.source,
  }
  let newBatch = []

  for (let i = 0; i < batch.length; i++) {
    let result = yield yield toot(processEvent, config, batch[i])

    if (result instanceof Result) {
      result.command = result.command || batch[i]
      return result
    }

    if (!result || typeof result !== 'object') {
      throw new Error(
        'The result of processing a command must be a command object or an instance of Result'
      )
    }

    newBatch[i] = result
  }

  return yield next(config, newBatch)
}

function* dispatch(config, batch) {
  let context

  for (let i = 0; i < batch.length; i++) {
    context = yield yield toot({
      name: 'dispatch',
      args: [config, batch[i], context],
      source: this.source,
      isFinalCommand: !batch[i + 1],
    })

    if (context instanceof Result) {
      context.command = context.command || batch[i]
      return context
    }
  }

  return new Result(context, batch[batch.length - 1])
}


module.exports = function* execute() {
  let config = yield hook('config')

  yield preHookStart('execute', function(batch) {
    let _config = config.value

    if (!_config) {
      throw new Error(
        'The config must already be defined at the beginning of "execute"'
      )
    }

    this.source = this.tooter
    return [_config, batch]
  })

  yield preHook({
    event: 'execute',
    tags: ['modifyBatch', 'modifyCommand', 'modifyOption'],
    goesBefore: ['modifyBatch'],
  }, (config, batch) => {
    batch = normalizeBatch(batch)
    return [config, batch]
  })

  yield preHook({
    event: 'execute',
    tags: ['assignCommandConfig', 'assignOptionConfig'],
  }, (config, batch) => {
    batch = assignConfigs(config, batch)
    return [config, batch]
  })

  yield hook({
    event: 'execute',
    tags: ['process'],
  }, process)

  yield hookEnd('execute', dispatch)

  yield hookEnd('dispatch', (config, command, context) => context)
}
