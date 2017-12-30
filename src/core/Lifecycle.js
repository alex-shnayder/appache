const Hooter = require('hooter')
const { next } = require('hooter/effects')
const rawEvents = require('./events')
const { optionsToObject } = require('./common')


const events = normalizeEventsConfig(rawEvents)


// - Adds tags that are mentioned in implies/goes*, but aren't present
// - Sets impliedBy
function normalizeEventsConfig(events) {
  let newEvents = {}

  Object.keys(events).forEach((eventName) => {
    let event = Object.assign({}, events[eventName])
    newEvents[eventName] = event

    let tags = Object.assign({}, event.tags)
    event.tags = tags

    Object.keys(tags).forEach((tagName) => {
      let tag = Object.assign({}, tags[tagName])
      tags[tagName] = tag

      if (tag.impliedBy) {
        throw new Error('"impliedBy" must not be set explicitly')
      }

      if (tag.goesAfter) {
        tag.goesAfter.forEach((goesAfterTagName) => {
          tags[goesAfterTagName] = tags[goesAfterTagName] || {}
        })
      }

      if (tag.goesBefore) {
        tag.goesBefore.forEach((goesBeforeTagName) => {
          tags[goesBeforeTagName] = tags[goesBeforeTagName] || {}
        })
      }

      if (tag.implies) {
        tag.implies.forEach((impliedTagName) => {
          tags[impliedTagName] = tags[impliedTagName] || {}
          tags[impliedTagName].impliedBy = tags[impliedTagName].impliedBy || []
          tags[impliedTagName].impliedBy.push(tagName)
        })
      }
    })
  })

  return newEvents
}

function expandImplied(items, itemsConfig, property, result = []) {
  let impliedItems = []

  for (let i = 0; i < items.length; i++) {
    let item = items[i]
    let implies = itemsConfig[item] && itemsConfig[item][property]

    if (!result.includes(item)) {
      result.push(item)
    }

    if (implies) {
      impliedItems.push(...implies)
    }
  }

  if (impliedItems.length) {
    expandImplied(impliedItems, itemsConfig, property, result)
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

  tags = expandImplied(tags, eventTags, 'implies')

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

  goesBefore = goesBefore && expandImplied(goesBefore, eventTags, 'impliedBy')
  goesAfter = goesAfter && expandImplied(goesAfter, eventTags, 'impliedBy')

  handler.tags = tags
  handler.goesBefore = goesBefore
  handler.goesAfter = goesAfter

  return handler
}


class LifecycleProxy extends Hooter.HooterProxy {
  constructor(...args) {
    super(...args)

    let { events } = this.source

    Object.keys(events).forEach((event) => {
      if (this[event]) {
        throw new Error(
          `Event "${event}" conflicts with the same-named method of Lifecycle`
        )
      }

      this[event] = events[event]
    })
  }

  createHandler(...args) {
    let handler = super.createHandler(...args)
    return updateHandlerTags(handler)
  }

  _createTapOrHandleHook(commandId, handler, checkIfCommandIsFinal) {
    if (typeof handler !== 'function') {
      throw new Error('A handler must be a function')
    }

    handler = this.wrap(handler)

    return function* tapOrHandleHook(config, _command, context) {
      if (
        typeof checkIfCommandIsFinal !== 'boolean' ||
        checkIfCommandIsFinal === _command.last
      ) {
        if (_command.config && _command.config.id === commandId) {
          let options = optionsToObject(_command.options)
          context = yield handler.call(this, options, context)
        }
      }

      return yield next(config, _command, context)
    }
  }

  handle(command, handler) {
    let hook = this._createTapOrHandleHook(command, handler, true)
    return this.hook({
      event: 'dispatch',
      tags: ['handleCommand'],
    }, hook)
  }

  tap(command, handler) {
    let hook = this._createTapOrHandleHook(command, handler, false)
    return this.hook({
      event: 'dispatch',
      tags: ['handleCommand'],
    }, hook)
  }

  tapAndHandle(command, handler) {
    let hook = this._createTapOrHandleHook(command, handler)
    this.hook({
      event: 'dispatch',
      tags: ['handleCommand'],
    }, hook)
  }
}

class Lifecycle extends Hooter {
  proxy(settings) {
    return new LifecycleProxy(this, settings)
  }
}

module.exports = Lifecycle
