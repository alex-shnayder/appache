const {
  suspend, getResume, toot, hook, hookEnd, preHookStart,
} = require('hooter/effects')
const { Result } = require('../common')
const preprocessBatch = require('./preprocessBatch')


function ProcessingResult(command, resume) {
  this.command = command
  this.resume = resume
}

function validateCommand(command) {
  if (!command || typeof command !== 'object') {
    throw new Error('The result of processing a command must be a command object')
  }
}

function* processCb(_, command) {
  validateCommand(command)
  let resume = yield getResume()
  let result = new ProcessingResult(command, resume)
  return yield suspend(result)
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
    batch = preprocessBatch(batch, _config)
    return [_config, batch]
  })

  yield hookEnd('execute', function* (config, batch) {
    let processEvent = {
      name: 'process',
      cb: processCb,
      source: this.source,
    }
    let resumes = []
    let context

    for (let i = 0; i < batch.length; i++) {
      let result = yield yield toot(processEvent, config, batch[i])

      // If the result is not an instance of ProcessingResult,
      // it means that a handler has returned early effectively
      // completing the execution
      if (result instanceof ProcessingResult) {
        batch[i] = result.command
        resumes[i] = result.resume
      } else if (result instanceof Result) {
        result.command = result.command || batch[i]
        return result
      } else {
        return result
      }
    }

    for (let i = 0; i < batch.length; i++) {
      context = yield yield toot({
        name: 'handle',
        args: [config, batch[i], context],
        source: this.source,
        isFinalCommand: !batch[i + 1],
      })

      if (context instanceof Result) {
        context.command = context.command || batch[i]
        return context
      }

      context = yield resumes[i](context)

      if (context instanceof Result) {
        context.command = context.command || batch[i]
        return context
      }
    }

    return new Result(context, batch[batch.length - 1])
  })

  yield hookEnd('handle', (config, command, context) => context)
}
