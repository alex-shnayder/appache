const { InputError } = require('../../core/common')


module.exports = function dontHandleAbstractCommand(command, isFinal) {
  if (isFinal && command.config && command.config.abstract) {
    let err = new InputError(
      `Command "${command.inputName}" cannot be used directly. ` +
      'Please specify a subcommand'
    )
    err.command = command
    throw err
  }
}
