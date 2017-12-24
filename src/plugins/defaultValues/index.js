const { preHook } = require('hooter/effects')
const { findByIds } = require('../../core/common')
const modifySchema = require('./modifySchema')


function getOptionsWithDefaultValues(optionConfigs) {
  return optionConfigs.reduce((options, optionConfig) => {
    let { name, defaultValue } = optionConfig

    if (typeof defaultValue !== 'undefined') {
      options.push({
        name: name,
        inputName: name,
        value: defaultValue,
        config: optionConfig,
        addedByDefaultValues: true,
      })
    }

    return options
  }, [])
}

function addOptionsToCommand(config, command) {
  let optionIds = command.config && command.config.options

  if (!optionIds) {
    return command
  }

  let optionConfigs = findByIds(config.options, optionIds)
  let options = getOptionsWithDefaultValues(optionConfigs)

  if (options.length) {
    command = Object.assign({}, command)
    command.options = (command.options || []).concat(options)
  }

  return command
}

function filterOutRepeatedOptions(options) {
  return options.filter((option) => {
    if (!option.addedByDefaultValues) {
      return true
    }

    return !options.find((o) => {
      return o.config.id === option.config.id && !o.addedByDefaultValues
    })
  })
}

function setDefaultValues(options) {
  return options.map((option) => {
    let { value, config } = option

    if (value === undefined && config.defaultValue !== undefined) {
      option = Object.assign({}, option)
      option.value = config.defaultValue
    }

    return option
  })
}

function processBatch(batch) {
  return batch.map((command) => {
    let { options } = command

    if (options && options.length) {
      options = filterOutRepeatedOptions(options)
      options = setDefaultValues(options)
      command = Object.assign({}, command, { options })
    }

    return command
  })
}

module.exports = function* defaultValues() {
  yield preHook({
    event: 'schematize',
    tags: ['modifySchema'],
  }, (schema) => [modifySchema(schema)])

  yield preHook({
    event: 'execute',
    tags: ['addOption'],
    goesAfter: ['identifyCommand'],
  }, (config, batch) => {
    batch = batch.map((command) => {
      return addOptionsToCommand(config, command)
    })
    return [config, batch]
  })

  yield preHook({
    event: 'execute',
    tags: ['modifyOption', 'removeOption'],
    goesAfter: ['identifyOption'],
  }, (config, batch) => {
    batch = processBatch(batch)
    return [config, batch]
  })
}
