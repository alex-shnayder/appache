const { preHook } = require('hooter/effects')
const { InputError } = require('../../common')
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

module.exports = function* requirePlugin() {
  yield preHook('schema', (schema) => {
    schema = modifySchema(schema)
    return [schema]
  })

  yield preHook('process', (_, { config, options }) => {
    if (config && config.options && config.options.length) {
      validateCommand(config, options)
    }
  })
}
