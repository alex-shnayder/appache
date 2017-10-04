const {
  suspend, getResume, toot, hookEnd, hookResult, preHookStart,
} = require('hooter/effects')
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

function handleCb(config, command, context) {
  return context
}


module.exports = function* executePlugin() {
  let config = yield hookResult('config')

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
      } else {
        return result
      }
    }

    for (let i = 0; i < request.length; i++) {
      let event = {
        name: (request[i + 1]) ? 'tap' : 'handle',
        cb: handleCb,
        source: this.source,
      }
      context = yield yield toot(event, config, request[i], context)
      context = yield resumes[i](context)
    }

    return context
  })
}

module.exports.tags = ['core']
