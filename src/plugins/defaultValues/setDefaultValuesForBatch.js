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

module.exports = function setDefaultValuesForBatch(batch) {
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
