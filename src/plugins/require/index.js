const { preHook } = require('hooter/effects')
const { InputError, findByIds } = require('../../core/common')
const modifySchema = require('./modifySchema')


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

function normalizeConfig(config) {
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

function validateCommand(config, command) {
  let { config: commandConfig, options, inputName, name } = command
  let { requiredOptions } = commandConfig

  if (!requiredOptions) {
    return
  }

  requiredOptions.forEach((requiredOptionName) => {
    let requiredOption = options.find((option) => {
      return option.config && option.config.name === requiredOptionName
    })

    if (!requiredOption) {
      throw new InputError(
        `Option "${requiredOptionName}" is required, ` +
        `but not present on command "${inputName || name}"`
      )
    }
  })
}


module.exports = function* require() {
  yield preHook({
    event: 'schematize',
    tags: ['modifyOptionSchema'],
  }, (schema) => {
    schema = modifySchema(schema)
    return [schema]
  })

  yield preHook({
    event: 'configure',
    tags: ['modifyCommandConfig'],
    goesAfter: ['modifyCommandConfig'],
  }, (schema, config) => {
    config = normalizeConfig(config)
    return [schema, config]
  })

  yield preHook({
    event: 'execute',
    goesAfter: ['modifyOption'],
    goesBefore: ['handleBatch'],
  }, (config, batch) => {
    batch.forEach((command) => {
      validateCommand(config, command)
    })
  })
}
