const { preHook } = require('hooter/effects')
const { InputError } = require('../../core/common')
const coercers = require('./coercers')


const TYPES = ['string', 'boolean', 'number', 'function']


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

  if (typeof value !== type || Number.isNaN(value)) {
    let err = new InputError(
      `The value of option "${inputName}" must be a ${type}`
    )
    err.command = command
    throw err
  }

  return Object.assign({}, option, { value })
}

function processCommand(command) {
  let { options } = command

  if (!options || !options.length) {
    return command
  }

  options = options.map((option) => processOption(command, option))
  return Object.assign({}, command, { options })
}

module.exports = function* basicTypes() {
  yield preHook({
    event: 'execute',
    tags: ['modifyOption'],
  }, (config, batch) => {
    batch = batch.map(processCommand)
    return [config, batch]
  })
}
