const {
  InputError, findByIds, findOneByNames, findRootCommands, findCommandById,
} = require('../../common')


function assignOptionConfig(optionConfigs, option) {
  let { name, inputName } = option

  if (!name || typeof name !== 'string') {
    throw new InputError(`Option "${inputName}" has an invalid name`)
  }

  option = Object.assign({}, option)
  option.config = findOneByNames(optionConfigs, name)
  return option
}

function assignCommandConfig(config, commandConfigs, defCommand, command) {
  let { name, inputName } = command

  if (!name || typeof name !== 'string') {
    throw new InputError(`Command "${inputName}" has an invalid name`)
  }

  let commandConfig = commandConfigs && findOneByNames(commandConfigs, name)
  commandConfig = commandConfig || defCommand

  if (!commandConfig) {
    return command
  }

  command = Object.assign({}, command)
  command.config = commandConfig

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

function assignOptionConfigs(config, batch) {
  return batch.map((command) => {
    let { options, config: commandConfig } = command
    let optionIds = commandConfig && commandConfig.options

    if (optionIds && optionIds.length && options.length) {
      let optionConfigs = findByIds(config.options, optionIds)

      if (optionConfigs && optionConfigs.length) {
        command = Object.assign({}, command)
        command.options = options.map((option) => {
          return assignOptionConfig(optionConfigs, option)
        })
      }
    }

    return command
  })
}

module.exports = { assignCommandConfigs, assignOptionConfigs }
