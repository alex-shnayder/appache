function assignItemDefaults(itemSchema, item) {
  item = Object.assign({}, item)

  Object.keys(itemSchema.properties).forEach((key) => {
    let prop = itemSchema.properties[key]
    if (typeof prop.default !== 'undefined' &&
        typeof item[key] === 'undefined') {
      item[key] = prop.default
    }
  })

  return item
}

module.exports = function assignDefaults(schema, config) {
  let { commands, options } = config
  let hasCommands = commands && commands.length
  let hasOptions = options && options.length

  if (hasCommands) {
    let commandSchema = schema.definitions.command
    commands = commands.map((command) => {
      return assignItemDefaults(commandSchema, command)
    })
  }

  if (hasOptions) {
    let optionSchema = schema.definitions.option
    options = options.map((option) => {
      return assignItemDefaults(optionSchema, option)
    })
  }

  if (hasCommands || hasOptions) {
    return Object.assign({}, config, { commands, options })
  } else {
    return config
  }
}
