const { findByIds } = require('../../core/common')


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

module.exports = function addOptionsToCommand(config, command) {
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
