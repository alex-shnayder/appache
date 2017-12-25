const {
  InputError, findByIds, findOneByNames, findRootCommands,
  findCommandById, findOptionById,
} = require('../../common')


function assignCommandConfig(config, commandConfigs, defCommand, command) {
  let { name, inputName } = command

  if (!name || typeof name !== 'string') {
    throw new InputError(`Command "${inputName}" has an invalid name`)
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
  let { defaultCommand: defCommand } = config

  return batch.map((command) => {
    defCommand = defCommand && findCommandById(config, defCommand)
    command = assignCommandConfig(config, commands, defCommand, command)
    ;({ commands, defaultCommand: defCommand } = command.config || {})
    commands = commands && findByIds(config.commands, commands)
    return command
  })
}

function assignOptionConfig(optionConfigs, defaultOption, option) {
  let { name, inputName } = option

  if (!name || typeof name !== 'string') {
    throw new InputError(`Option "${inputName}" has an invalid name`)
  }

  let optionConfig = optionConfigs && findOneByNames(optionConfigs, name)

  if (!optionConfig && defaultOption) {
    optionConfig = Object.assign({}, defaultOption)
    // There must be a better way to tell other plugins not to use the name
    // from the option's config
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
      defaultOption = findOptionById(config, defaultOption)

      command = Object.assign({}, command)
      command.options = options.map((option) => {
        return assignOptionConfig(optionConfigs, defaultOption, option)
      })
    }

    return command
  })
}


module.exports = { assignCommandConfigs, assignOptionConfigs }
