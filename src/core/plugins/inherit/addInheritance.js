const {
  findRootCommands, updateCommandById, populateCommand,
} = require('../../common')


function inheritCommandSettings(
  config, command, inheritedConfig, inheritedOptions
) {
  let { inheritableSettings, inheritableOptions, commands } = command
  let hasInheritableSettings = inheritableSettings && inheritableSettings.length

  if (!inheritedConfig && !inheritedOptions && !hasInheritableSettings) {
    return config
  }

  let options = command.options ? command.options : []
  options = inheritedOptions ? options.concat(inheritedOptions) : options

  if (inheritedConfig) {
    command = Object.assign({}, inheritedConfig, command, { options })
    config = updateCommandById(config, command.id, command, true)
    inheritableSettings = command.inheritableSettings
    inheritableOptions = command.inheritableOptions
  }

  if (commands && commands.length) {
    let inheritableConfig = inheritableSettings.reduce((_config, key) => {
      if (typeof command[key] !== 'undefined') {
        _config[key] = command[key]
      } else if (inheritedConfig) {
        _config[key] = inheritedConfig[key]
      }

      return _config
    }, {})

    command = populateCommand(config, command)
    command.commands.forEach((subcommand) => {
      config = inheritCommandSettings(
        config, subcommand, inheritableConfig, inheritableOptions
      )
    })
  }

  return config
}

module.exports = function addInheritance(schema, config) {
  let commands = findRootCommands(config)

  if (commands.length) {
    commands.forEach((command) => {
      config = inheritCommandSettings(config, command)
    })
  }

  return config
}
