const { InputError } = require('../../common')
const handleUndefinedCommand = require('./handleUndefinedCommand')


function validateCommand(config, parent, command) {
  let { options, config: cmdConfig } = command

  if (!cmdConfig) {
    return handleUndefinedCommand(config, parent, command)
  }

  if (cmdConfig.strict) {
    let undefinedOption = options.find((option) => !option.config)

    if (undefinedOption) {
      let e = new InputError(`Undefined option "${undefinedOption.inputName}"`)
      e.command = command
      throw e
    }
  }
}

module.exports = function validateBatch(config, batch) {
  batch.reduce((parent, command) => {
    validateCommand(config, parent, command)
    return command
  }, null)
}
