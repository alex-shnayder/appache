const { preHook } = require('hooter/effects')
const { InputError, findCommandByFullName } = require('../../common')
const modifySchema = require('./modifySchema')
const handleUnknownCommand = require('./handleUnknownCommand')


function validateCommandOptions(options) {
  let option = options.find((option) => !option.config)

  if (option) {
    throw new InputError(`Unknown option "${option.inputName}"`)
  }
}

module.exports = function* restrictPlugin() {
  yield preHook('schema', (schema) => {
    schema = modifySchema(schema)
    return [schema]
  })

  yield preHook('process', (config, command) => {
    let { fullName, options, config: commandConfig } = command

    if (!commandConfig) {
      let isValid = (fullName.length > 1)
      let parentConfig

      if (isValid) {
        let parentFullName = fullName.slice(0, -1)
        parentConfig = findCommandByFullName(config, parentFullName, true)
        isValid = parentConfig && !parentConfig.restrictCommands
      }

      if (!isValid) {
        handleUnknownCommand(command, parentConfig)
      }
    } else if (commandConfig.restrictOptions && options) {
      validateCommandOptions(options)
    }
  })
}
