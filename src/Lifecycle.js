const Hooter = require('hooter')
const { next } = require('hooter/effects')
const { optionsToObject, compareNames } = require('./common')


class LifecycleProxy extends Hooter.HooterProxy {
  _createTapOrHandleHook(command, handler, checkIfCommandIsFinal) {
    if (typeof command !== 'string' && !Array.isArray(command)) {
      throw new Error('A command must either be a string or an array of strings')
    }

    if (typeof handler !== 'function') {
      throw new Error('A handler must be a function')
    }

    handler = this.wrap(handler)

    return function* tapOrHandleHook(config, _command, context) {
      if (
        typeof checkIfCommandIsFinal !== 'boolean' ||
        checkIfCommandIsFinal === this.isFinalCommand
      ) {
        let { fullName, options } = _command

        if (compareNames(fullName, command, true)) {
          options = optionsToObject(options)
          context = yield handler(options, context, fullName)
        }
      }

      return yield next(config, _command, context)
    }
  }

  handle(command, handler) {
    let hook = this._createTapOrHandleHook(command, handler, true)
    return this.hook({
      event: 'handle',
      tags: ['handleCommand'],
    }, hook)
  }

  tap(command, handler) {
    let hook = this._createTapOrHandleHook(command, handler, false)
    return this.hook({
      event: 'handle',
      tags: ['tapCommand'],
    }, hook)
  }

  tapAndHandle(command, handler) {
    let hook = this._createTapOrHandleHook(command, handler)
    this.hook({
      event: 'handle',
      tags: ['handleCommand', 'tapCommand'],
    }, hook)
  }
}

class Lifecycle extends Hooter {
  proxy(settings) {
    return new LifecycleProxy(this, settings)
  }
}

module.exports = Lifecycle
