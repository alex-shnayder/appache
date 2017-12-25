const { InputError } = require('../../core/common')


function validateOption(command, option) {
  let { config, value, inputName } = option

  if (config && config.validate) {
    let validate = config.validate

    if (typeof validate === 'function') {
      validate(option)
    } else if (validate instanceof RegExp) {
      if (!validate.test(value)) {
        let err = new InputError(
          `Value "${value}" of option "${inputName}" ` +
          `does not match the regular expression ${validate}`
        )
        err.command = command
        throw err
      }
    } else {
      throw new Error('"validate" must be either a function or a regular expression')
    }
  }
}

function validateCommand(command) {
  if (command.options) {
    command.options.forEach((option) => validateOption(command, option))
  }
}


module.exports = validateCommand
