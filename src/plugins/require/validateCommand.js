const { InputError } = require('../../core/common')


module.exports = function validateCommand(config, command) {
  let { config: commandConfig, options, inputName, name } = command
  let { requiredOptions } = commandConfig

  if (!requiredOptions) {
    return
  }

  requiredOptions.forEach((requiredOptionName) => {
    let requiredOption = options.find((option) => {
      return option.config && option.config.name === requiredOptionName
    })

    if (!requiredOption) {
      let err = new InputError(
        `Option "${requiredOptionName}" is required, ` +
        `but not present on command "${inputName || name}"`
      )
      err.command = command
      throw err
    }
  })
}
