const { next, hook } = require('hooter/effects')
const validators = require('./validators')
const coercers = require('./coercers')


const CONSUME_BY_TYPE = {
  boolean: false,
}


function modifyOptions(options) {
  return options.map((option) => {
    let { type, validate, coerce, consume } = option

    if (!type || (validate && coerce && typeof consume !== 'undefined')) {
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
