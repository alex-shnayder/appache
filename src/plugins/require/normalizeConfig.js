const { findByIds } = require('../../core/common')


function getRequiredOptionsForCommand(config, command) {
  let { requiredOptions, options } = command
  let requireAll = false

  if (requiredOptions === true) {
    requireAll = true
    requiredOptions = []
  } else if (!requiredOptions) {
    requiredOptions = []
  } else {
    requiredOptions = requiredOptions.slice()
  }

  if (options) {
    findByIds(config.options, options).forEach(({ name, required }) => {
      if (required === false) {
        requiredOptions = requiredOptions.filter((n) => n !== name)
      } else if ((required || requireAll) && !requiredOptions.includes(name)) {
        requiredOptions.push(name)
      }
    })
  }

  return requiredOptions
}

module.exports = function normalizeConfig(config) {
  let { commands } = config

  if (commands && commands.length) {
    commands = commands.map((command) => {
      let requiredOptions = getRequiredOptionsForCommand(config, command)
      return Object.assign({}, command, { requiredOptions })
    })
    config = Object.assign({}, config, { commands })
  }

  return config
}
