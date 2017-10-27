const {
  suspend, getResume, toot, hook, hookEnd, preHookStart,
} = require('hooter/effects')
const { Break, Help } = require('../../common')
const preprocessRequest = require('./preprocessRequest')


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

  yield preHookStart('execute', function(request) {
    let _config = config.value

    if (!_config) {
      throw new Error(
        'The config must already be defined at the beginning of "execute"'
      )
    }

    this.source = this.tooter
    request = preprocessRequest(request, _config)
    return [_config, request]
  })

  yield hookEnd('execute', function* (config, request) {
    let processEvent = {
      name: 'process',
      cb: processCb,
      source: this.source,
    }
    let resumes = []
    let context

    for (let i = 0; i < request.length; i++) {
      let result = yield yield toot(processEvent, config, request[i])

      // If the result is not an instance of ProcessingResult,
      // it means that a handler has returned early effectively
      // completing the execution
      if (result instanceof ProcessingResult) {
        request[i] = result.command
        resumes[i] = result.resume
      } else if (result instanceof Break) {
        return result.value
      } else if (result instanceof Help) {
        let helpResult = new Help()
        helpResult.command = request[i]
        return helpResult
      } else {
        return result
      }
    }

    for (let i = 0; i < request.length; i++) {
      context = yield yield toot({
        name: 'handle',
        args: [config, request[i], context],
        source: this.source,
        isFinalCommand: !request[i + 1],
      })

      if (context instanceof Break) {
        return context.value
      } else if (context instanceof Help) {
        let result = new Help()
        result.command = request[i]
        return result
      }

      context = yield resumes[i](context)
    }

    return context
  })

  yield hookEnd('handle', (config, command, context) => context)
}
