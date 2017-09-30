const { next, hook } = require('hooter/effects')
const { InputError } = require('../../common')
const coercers = require('./coercers')


const TYPES = ['string', 'boolean', 'number', 'function']
const CONSUME_BY_TYPE = {
  boolean: false,
}


let validators = TYPES.reduce((result, type) => {
  result[type] = function validateBasicType({ inputName, value }) {
    if (typeof value !== type || Number.isNaN(value)) {
      throw new InputError(
        `The value of option "${inputName}" must be a ${type}`
      )
    }
  }
  return result
}, {})


function modifyOptions(options) {
  return options.map((option) => {
    let { type, validate, coerce, consume } = option

    if (
      !type ||
      (validate && coerce && typeof consume !== 'undefined') ||
      !TYPES.includes(type)
    ) {
      return option
    }

    consume = CONSUME_BY_TYPE[type]
    validate = validators[type]
    coerce = coercers[type]

    return Object.assign({ validate, coerce, consume }, option)
  })
}

module.exports = function* typesPlugin() {
  yield hook('config', function* (schema, config, ...args) {
    let { options } = config

    if (!options) {
      return yield next(schema, config, ...args)
    }

    options = modifyOptions(options)
    config = Object.assign({}, config, { options })
    return yield next(schema, config, ...args)
  })
}
