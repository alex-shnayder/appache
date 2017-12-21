const { preHook } = require('hooter/effects')
const { findByIds } = require('../../core/common')
const modifySchema = require('./modifySchema')


function setDefaulValues(optionConfigs, options) {
  options = options.slice()
  optionConfigs.forEach((optionConfig) => {
    if (typeof optionConfig.defaultValue === 'undefined') {
      return
    }

    let optionIndex = options.findIndex((option) => {
      return option.config && option.config.id === optionConfig.id
    })
    let option = options[optionIndex]

    if (option && typeof option.value === 'undefined') {
      options[optionIndex] = Object.assign({}, option, {
        value: optionConfig.defaultValue,
      })
    } else if (!option) {
      options.push({
        name: optionConfig.name,
        inputName: optionConfig.name,
        value: optionConfig.defaultValue,
        config: optionConfig,
      })
    }
  })
  return options
}

function setDefaultOptionValuesForCommand(config, command) {
  let commandOptions = command.config.options

  if (!commandOptions || !commandOptions.length) {
    return command
  }

  let optionConfigs = findByIds(config.options, commandOptions)
  let options = setDefaulValues(optionConfigs, command.options)

  return Object.assign({}, command, { options })
}

module.exports = function* defaultValues() {
  yield preHook({
    event: 'schematize',
    tags: ['modifySchema'],
  }, (schema) => [modifySchema(schema)])

  yield preHook({
    event: 'process',
    tags: ['modifyOption'],
    goesBefore: ['modifyOption'],
  }, (config, command) => {
    command = setDefaultOptionValuesForCommand(config, command)
    return [config, command]
  })
}
