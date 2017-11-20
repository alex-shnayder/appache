function markCommands(commands) {
  let newCommands = []
  let nonRootCommands = {}

  for (let i = 0; i < commands.length; i++) {
    let subcommands = commands[i].commands

    if (subcommands) {
      for (let j = 0; j < subcommands.length; j++) {
        nonRootCommands[subcommands[j]] = true
      }
    }
  }

  for (let i = 0; i < commands.length; i++) {
    let command = Object.assign({}, commands[i])
    command.defined = true
    command.root = !nonRootCommands[command.id]
    newCommands[i] = command
  }

  return newCommands
}

function markOptions(options) {
  let newOptions = []

  for (let i = 0; i < options.length; i++) {
    let option = Object.assign({}, options[i])
    option.defined = true
    newOptions[i] = option
  }

  return newOptions
}

function finalizeConfig(schema, config) {
  let { commands, options } = config
  config = Object.assign({}, config)
  config.commands = commands && markCommands(commands)
  config.options = options && markOptions(options)
  config.final = true
  return config
}


module.exports = finalizeConfig
