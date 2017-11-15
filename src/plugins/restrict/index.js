const { preHook } = require('hooter/effects')
const { InputError, findCommandByFullName } = require('../../common')
const modifySchema = require('./modifySchema')
const handleUndefinedCommand = require('./handleUndefinedCommand')


function validateCommand(config, command) {
  let { fullName, options, config: cmdConfig } = command
  let isUndefined = !cmdConfig || !cmdConfig.defined
  let needsOptionsChecked = cmdConfig && cmdConfig.restrictOptions && options

  if (isUndefined) {
    let isValid = (fullName.length > 1)
    let parentConfig

    if (isValid) {
      let parentFullName = fullName.slice(0, -1)
      let parentConfig = findCommandByFullName(config, parentFullName, true)
      isValid = !parentConfig || !parentConfig.restrictCommands
    }

    if (!isValid) {
      handleUndefinedCommand(command, parentConfig)
    }
  }

  if (needsOptionsChecked) {
    let undefinedOption = options.find((option) => !option.defined)

    if (undefinedOption) {
      throw new InputError(`Unknown option "${undefinedOption.inputName}"`)
    }
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
