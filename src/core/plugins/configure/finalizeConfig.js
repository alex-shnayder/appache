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
    command.root = !nonRootCommands[command.id]
    newCommands[i] = command
  }

  return newCommands
}

function finalizeConfig(schema, config) {
  let { commands } = config
  config = Object.assign({}, config)
  config.commands = commands && markCommands(commands)
  config.final = true
  return config
}


module.exports = finalizeConfig
