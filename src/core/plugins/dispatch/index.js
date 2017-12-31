const { toot, hook, hookEnd } = require('hooter/effects')
const { Result } = require('../../common')


function createDispatchEvent(parentEvent, args) {
  let event = Object.assign({}, this)
  event.name = 'dispatch'
  event.args = args

  delete event.mode
  delete event.tooter
  delete event.cb

  return event
}

function* dispatchCommands(config, batch) {
  let context

  for (let i = 0; i < batch.length; i++) {
    let event = createDispatchEvent(this, [config, batch[i], context])
    context = yield yield toot(event)

    if (context instanceof Result) {
      context.command = context.command || batch[i]
      return context
    }
  }

  return new Result(context, batch[batch.length - 1])
}

function dispatchApex(config, command, context) {
  return context
}


module.exports = function* dispatch() {
  yield hook({
    event: 'execute',
    tags: ['handleBatch'],
    goesAfter: ['handleBatch'],
  }, dispatchCommands)

  yield hookEnd('dispatch', dispatchApex)
}
