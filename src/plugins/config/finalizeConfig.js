function markRootCommands(commands) {
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
    let command = commands[i]
    let isRoot = !nonRootCommands[command.id]

    // eslint-disable-next-line eqeqeq
    if (isRoot != command.root) {
      command = Object.assign({}, command)
      command.root = isRoot
    }

    newCommands[i] = command
  }

  return newCommands
}

function finalizeConfig(schema, config) {
  config = Object.assign({}, config)
  config.commands = markRootCommands(config.commands)
  config.final = true
  return config
}


module.exports = finalizeConfig
