const objectPathImmutable = require('object-path-immutable')
const wildcardMatch = require('wildcard-match')


class InputError extends Error {}

function Result(value, command) {
  let result = Object.create(Result.prototype)
  result.value = value
  result.command = command
  return result
}

function Help(command) {
  let help = Object.create(Help.prototype)
  help.command = command
  return help
}

Help.prototype = Object.create(Result.prototype)


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

function findCommandByFullName(config, fullName, populate) {
  let commands = config.commands || []
  let command

  for (let i = 0; i < fullName.length; i++) {
    command = findOneByNames(commands, fullName[i])

    if (!command) {
      return
    }

    commands = findByIds(config.commands, command.commands)
  }

  if (command && populate) {
    command = populateCommand(config, command)
  }

  return command
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

function compareNames(nameA, nameB, allowWildcards) {
  nameA = (typeof nameA === 'string') ? [nameA] : nameA
  nameB = (typeof nameB === 'string') ? [nameB] : nameB

  if (!Array.isArray(nameA) || !Array.isArray(nameB)) {
    throw new Error('A name must be an array or a string')
  }

  if (allowWildcards) {
    return wildcardMatch(nameA, nameB)
  } else {
    return nameA.length === nameB.length &&
      nameA.every((n, i) => nameB[i] === n)
  }
}

function getCommandFromEvent(event) {
  let { args, name } = event

  if (name === 'execute') {
    return args && args[1] && args[1][0]
  } else if (name === 'process' || name === 'handle' || name === 'tap') {
    return args && args[1]
  }
}

function assignDefaults(itemSchema, item) {
  item = Object.assign({}, item)

  Object.entries(itemSchema.properties).forEach(([key, prop]) => {
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
  InputError, Result, Help, findByIds, findOneById, findOneByNames,
  findCommandById, findOptionById, findCommandByFullName, findRootCommands,
  populateCommand, updateCommandById, updateOptionById, optionsToObject,
  compareNames, getCommandFromEvent, assignDefaults, createCommand,
  createOption,
}

Object.assign(module.exports, objectPathImmutable)
