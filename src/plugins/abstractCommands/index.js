const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const dontHandleAbstractCommand = require('./dontHandleAbstractCommand')


function schematizeHandler(schema) {
  schema = modifySchema(schema)
  return [schema]
}

function dispatchHandler(config, command) {
  dontHandleAbstractCommand(command, this.isFinalCommand)
}


module.exports = function* abstractCommands() {
  yield preHook({
    event: 'schematize',
    tags: ['modifyCommandSchema'],
  }, schematizeHandler)

  yield preHook({
    event: 'dispatch',
    tags: ['handleCommand'],
    goesBefore: ['handleCommand'],
  }, dispatchHandler)
}
