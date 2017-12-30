const { toot, hook, hookEnd } = require('hooter/effects')
const { Result } = require('../../common')


function* dispatchCommands(config, batch) {
  let context

  for (let i = 0; i < batch.length; i++) {
    context = yield yield toot({
      name: 'dispatch',
      args: [config, batch[i], context],
      source: this.source,
    })

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
