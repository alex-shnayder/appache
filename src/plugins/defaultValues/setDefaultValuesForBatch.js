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

module.exports = function setDefaultValuesForBatch(batch) {
  return batch.map((command) => {
    let { options } = command

    if (options && options.length) {
      command = Object.assign({}, command)
      command.options = setDefaultValues(options)
    }

    return command
  })
}
