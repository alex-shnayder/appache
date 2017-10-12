const { preHook } = require('hooter/effects')
const { InputError } = require('../../common')
const coercers = require('./coercers')


const TYPES = ['string', 'boolean', 'number', 'function']


function processOption(option) {
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

  if (typeof value !== type || Number.isNaN(value)) {
    throw new InputError(
      `The value of option "${inputName}" must be a ${type}`
    )
  }

  return Object.assign({}, option, { value })
}

module.exports = function* basicTypesPlugin() {
  yield preHook({
    event: 'process',
    goesBefore: ['owner:coercePlugin', 'owner:validatePlugin'],
    goesAfter: ['owner:defaultValuesPlugin'],
  }, (config, command) => {
    let { options } = command

    if (options) {
      options = options.map(processOption)
    }

    command = Object.assign({}, command, { options })
    return [config, command]
  })
}
