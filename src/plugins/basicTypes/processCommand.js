const { InputError } = require('../../core/common')
const coercers = require('./coercers')


const TYPES = ['auto', 'string', 'boolean', 'number', 'function']


function isValueValid(value, type) {
  let valueType = typeof value

  if (type === 'auto') {
    return value === null || ['string', 'number', 'boolean'].includes(valueType)
  }

  return (valueType === type && !Number.isNaN(value))
}

function processOption(command, option) {
  let { config, value, inputName } = option

  if (!config) {
    return option
  }

  let { type } = config

  if (!TYPES.includes(type)) {
    return option
  }

  if (coercers[type]) {
    value = coercers[type](value)
  }

  if (!isValueValid(value, type)) {
    let err = new InputError(
      `The value of option "${inputName}" must be of type "${type}"`
    )
    err.command = command
    throw err
  }

  return Object.assign({}, option, { value })
}

module.exports = function processCommand(command) {
  let { options } = command

  if (!options || !options.length) {
    return command
  }

  options = options.map((option) => processOption(command, option))
  return Object.assign({}, command, { options })
}
