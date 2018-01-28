const {
  InputError, findByIds, findOneByNames, findRootCommands,
  findCommandById, findOptionById,
} = require('../../common')


function assignCommandConfig(config, commandConfigs, defCommand, command) {
  let { name, inputName } = command

  if (!name || typeof name !== 'string') {
    let err = new InputError(`Command "${inputName}" has an invalid name`)
    err.command = command
    throw err
  }

  let commandConfig = commandConfigs && findOneByNames(commandConfigs, name)
  commandConfig = commandConfig || defCommand

  if (commandConfig) {
    command = Object.assign({}, command)
    command.config = commandConfig
  }

  return command
}

function assignCommandConfigs(config, batch) {
  let commands = findRootCommands(config)
  let defaultCommand

  return batch.map((command) => {
    if (defaultCommand) {
      defaultCommand = findCommandById(config, defaultCommand)
    } else {
      defaultCommand = commands.find((command) => command.default)
    }

    command = assignCommandConfig(config, commands, defaultCommand, command)
    ;({ commands, defaultCommand } = command.config || {})
    commands = commands && findByIds(config.commands, commands)
    return command
  })
}

function assignOptionConfig(optionConfigs, defaultOption, option, command) {
  let { name, inputName } = option

  if (!name || typeof name !== 'string') {
    let err = new InputError(`Option "${inputName}" has an invalid name`)
    err.command = command
    throw err
  }

  let optionConfig = optionConfigs && findOneByNames(optionConfigs, name)

  if (!optionConfig && defaultOption) {
    // Default options are special: they aren't considered duplicates even
    // though all of them have the same id, and the names from their configs
    // shouldn't be used to reference them
    // TODO: find a better way to do this?
    optionConfig = Object.assign({}, defaultOption)
    optionConfig.default = true
    delete optionConfig.name
    delete optionConfig.aliases
  }

  if (optionConfig) {
    option = Object.assign({}, option)
    option.config = optionConfig
  }

  return option
}

function assignOptionConfigs(config, batch) {
  return batch.map((command) => {
    let { options, config: commandConfig } = command
    let { defaultOption } = commandConfig

    if (options && options.length) {
      let optionIds = commandConfig.options
      let optionConfigs = optionIds && findByIds(config.options, optionIds)

      if (defaultOption) {
        defaultOption = findOptionById(config, defaultOption)
      } else if (optionConfigs) {
        defaultOption = optionConfigs.find((option) => option.default)
      }

      command = Object.assign({}, command)
      command.options = options.map((option) => {
        return assignOptionConfig(optionConfigs, defaultOption, option, command)
      })
    }

    return command
  })
}


module.exports = { assignCommandConfigs, assignOptionConfigs }
