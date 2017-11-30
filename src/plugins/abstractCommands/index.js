const { preHook } = require('hooter/effects')
const { InputError } = require('../../core/common')
const modifySchema = require('./modifySchema')


function dontHandleAbstractCommand(_, command) {
  if (this.isFinalCommand && command.config && command.config.abstract) {
    let err = new InputError(
      `Command "${command.inputName}" cannot be used directly. ` +
      'Please specify a subcommand'
    )
    err.command = command
    throw err
  }
}

module.exports = function* abstractCommands() {
  yield preHook({
    event: 'schema',
    tags: ['modifyCommandSchema'],
  }, (schema) => {
    schema = modifySchema(schema)
    return [schema]
  })

  yield preHook({
    event: 'dispatch',
    tags: ['handleCommand'],
    goesBefore: ['tapCommand', 'handleCommand'],
  }, dontHandleAbstractCommand)
}
