const { InputError } = require('../../common')
const handleUndefinedCommand = require('./handleUndefinedCommand')


function validateCommands(config, batch) {
  batch.reduce((parent, command) => {
    if (!command.config) {
      handleUndefinedCommand(config, parent, command)
    }
    return command
  }, null)
}

function validateOptions(config, batch) {
  batch.forEach((command) => {
    let { options } = command
    let undefinedOption = options && options.find((option) => !option.config)

    if (undefinedOption) {
      let e = new InputError(`Undefined option "${undefinedOption.inputName}"`)
      e.command = command
      throw e
    }
  })
}


module.exports = { validateCommands, validateOptions }
