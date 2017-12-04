function findByIds(items, ids) {
  return ids
    .map((id) => {
      return items.find((item) => item.id === id)
    })
    .filter((item) => item)
}

function findOneById(items, id) {
  return items.find((item) => item.id === id)
}

function findOneByNames(items, names) {
  if (Array.isArray(names)) {
    return items.find((item) => {
      let { name, aliases } = item
      return names.find((n) => n === name || (aliases && aliases.includes(n)))
    })
  }

  return items.find((item) => {
    return item.name === names || (item.aliases && item.aliases.includes(names))
  })
}

function findCommandById(config, id, populate) {
  let { commands } = config

  if (!commands || !commands.length) {
    return
  }

  let command = findOneById(commands, id)

  if (command && populate) {
    return populateCommand(config, command)
  }
}

function findOptionById(config, id) {
  let { options } = config

  if (options && options.length) {
    return findOneById(options, id)
  }
}

function findRootCommands(config, populate) {
  if (!config || !config.commands) {
    return []
  }

  let commands

  if (config.final) {
    commands = config.commands.filter((c) => c.root)
  } else {
    let nonRootCommands = config.commands.reduce((results, command) => {
      command.commands && command.commands.forEach((id) => {
        results[id] = true
      })
      return results
    }, {})

    commands = config.commands.filter((command) => !nonRootCommands[command.id])
  }

  if (populate) {
    commands = commands.map((c) => populateCommand(config, c))
  }

  return commands
}

function findDefaultRootCommand(config) {
  if (!config.defaultCommand) {
    return
  }
  let rootCommands = findRootCommands(config)
  return findOneByNames(rootCommands, config.defaultCommand)
}

function populateCommand(config, command) {
  let { options, commands } = command

  if (!options && !commands) {
    return command
  }

  return Object.assign({}, command, {
    options: options && findByIds(config.options, options),
    commands: commands && findByIds(config.commands, commands),
  })
}

function updateCommandById(config, id, command, overwrite) {
  let { commands } = config

  if (!commands || !commands.length) {
    throw new Error('The config doesn\'t have any commands')
  }

  let updatedCommands = []
  let commandFound = false

  for (let i = 0; i < commands.length; i++) {
    if (commands[i].id === id) {
      commandFound = true
      updatedCommands[i] = overwrite ?
        command :
        Object.assign({}, commands[i], command)
    } else {
      updatedCommands[i] = commands[i]
    }
  }

  if (!commandFound) {
    throw new Error(`Command "${id}" is not found`)
  }

  return Object.assign({}, config, {
    commands: updatedCommands,
  })
}

function updateOptionById(config, id, option, overwrite) {
  let { options } = config

  if (!options || !options.length) {
    throw new Error('The config doesn\'t have any options')
  }

  let updatedOptions = []
  let optionFound = false

  for (let i = 0; i < options.length; i++) {
    if (options[i].id === id) {
      optionFound = true
      updatedOptions[i] = overwrite ?
        option :
        Object.assign({}, options[i], option)
    } else {
      updatedOptions[i] = options[i]
    }
  }

  if (!optionFound) {
    throw new Error(`Option "${id}" is not found`)
  }

  return Object.assign({}, config, {
    options: updatedOptions,
  })
}

function optionsToObject(options) {
  if (!options || !options.length) {
    return {}
  }

  return options.reduce((object, { name, value }) => {
    if (name) {
      object[name] = value
    }
    return object
  }, {})
}

function getCommandFromEvent(event) {
  let { args, name } = event

  if (name === 'execute' || name === 'identify') {
    return args && args[1] && args[1][0]
  } else if (name === 'process' || name === 'dispatch') {
    return args && args[1]
  }
}

function assignDefaults(itemSchema, item) {
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

function createCommand(schema, command) {
  let commandSchema = schema.definitions.command
  return assignDefaults(commandSchema, command)
}

function createOption(schema, option) {
  let optionSchema = schema.definitions.option
  return assignDefaults(optionSchema, option)
}


module.exports = {
  findByIds, findOneById, findOneByNames, findCommandById, findOptionById,
  findRootCommands, findDefaultRootCommand, populateCommand, updateCommandById,
  updateOptionById, optionsToObject, getCommandFromEvent, assignDefaults,
  createCommand, createOption,
}
