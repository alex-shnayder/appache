const { preHook } = require('hooter/effects')
const { InputError, findCommandByFullName } = require('../../common')
const modifySchema = require('./modifySchema')
const handleUnknownCommand = require('./handleUnknownCommand')


function findClosestParentWithConfig(config, fullName) {
  let parentFullName = fullName.slice(0, -1)
  let parentConfig = findCommandByFullName(config, parentFullName, true)

  if (!parentConfig && parentFullName.length) {
    return findClosestParentWithConfig(config, parentFullName)
  }

  return parentConfig
}

function validateOptions(options) {
  let option = options.find((option) => !option.config)

  if (option) {
    throw new InputError(`Unknown option "${option.inputName}"`)
  }
}

function validateCommand(config, command) {
  let { fullName, options, config: commandConfig } = command

  if (!commandConfig) {
    let isValid = (fullName.length > 1)
    let parentConfig

    if (isValid) {
      parentConfig = findClosestParentWithConfig(config, fullName)
      isValid = parentConfig && !parentConfig.restrictCommands
    }

    if (!isValid) {
      handleUnknownCommand(command, parentConfig)
    }
  } else if (commandConfig.restrictOptions && options) {
    validateOptions(options)
  }
}


module.exports = function* restrict() {
  yield preHook({
    event: 'schema',
    tags: ['modifyCommandSchema'],
  }, (schema) => {
    schema = modifySchema(schema)
    return [schema]
  })

  yield preHook({
    event: 'process',
    goesAfter: ['modifyCommand', 'modifyOption'],
  }, validateCommand)
}
