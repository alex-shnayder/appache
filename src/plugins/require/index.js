const { preHook } = require('hooter/effects')
const { InputError } = require('../../core/common')
const modifySchema = require('./modifySchema')


function validateCommand(commandConfig, options) {
  commandConfig.options.forEach((optionConfig) => {
    if (optionConfig.required) {
      let option = options.find((option) => {
        return option.config && option.config.id === optionConfig.id
      })

      if (!option || option.value === null) {
        throw new InputError(`Option "${optionConfig.name}" is required`)
      }
    }
  })
}

module.exports = function* require() {
  yield preHook({
    event: 'schema',
    tags: ['modifyOptionSchema'],
  }, (schema) => {
    schema = modifySchema(schema)
    return [schema]
  })

  yield preHook({
    event: 'process',
    goesAfter: ['modifyOption'],
  }, (_, { config, options }) => {
    if (config && config.options && config.options.length) {
      validateCommand(config, options)
    }
  })
}
