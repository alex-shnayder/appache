const Hooter = require('hooter')
const { next } = require('hooter/effects')
const events = require('./events')
const { optionsToObject, compareNames } = require('./common')


function expandTags(tags, tagsConfig, result = []) {
  let impliedTags = []

  for (let i = 0; i < tags.length; i++) {
    let tag = tags[i]
    let implies = tagsConfig[tag] && tagsConfig[tag].implies

    if (!result.includes(tag)) {
      result.push(tag)
    }

    if (implies) {
      impliedTags.push(implies)
    }
  }

  if (impliedTags.length) {
    expandTags(impliedTags, tagsConfig, result)
  }

  return result
}

// WARNING: mutates handler
function updateHandlerTags(handler) {
  let { event, tags, goesBefore, goesAfter } = handler
  let eventTags = events[event] && events[event].tags

  if (!tags || !tags.length || !eventTags) {
    return handler
  }

  tags = expandTags(tags, eventTags)

  for (let i = 0; i < tags.length; i++) {
    let tag = tags[i]
    let tagGoesBefore = eventTags[tag] && eventTags[tag].goesBefore
    let tagGoesAfter = eventTags[tag] && eventTags[tag].goesAfter

    if (tagGoesBefore) {
      goesBefore = goesBefore || []
      goesBefore.push(...tagGoesBefore)
    }

    if (tagGoesAfter) {
      goesAfter = goesAfter || []
      goesAfter.push(...tagGoesAfter)
    }
  }

  handler.tags = tags
  handler.goesBefore = goesBefore && goesBefore
  handler.goesAfter = goesAfter && goesAfter

  return handler
}


class LifecycleProxy extends Hooter.HooterProxy {
  createHandler(...args) {
    let handler = super.createHandler(...args)
    return updateHandlerTags(handler)
  }

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
          context = yield handler.call(this, options, context, fullName)
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
