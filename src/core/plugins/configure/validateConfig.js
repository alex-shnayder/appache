const Ajv = require('ajv')
const ajvKeywords = require('ajv-keywords')
const { findOneByNames, populateCommand } = require('../../common')


let ajv = new Ajv()
ajvKeywords(ajv, ['typeof', 'instanceof'])


function validateCommand(command) {
  let { commands, options } = command

  if (commands && commands.length) {
    commands.forEach((command) => {
      let { name, aliases } = command
      let names = aliases ? aliases.concat(name) : [name]
      let matchingCommand = findOneByNames(commands, names)

      if (matchingCommand && matchingCommand !== command) {
        throw new Error(
          `Command "${name}" has a name or alias ` +
          `that is already taken by "${matchingCommand.name}"`
        )
      }
    })
  }

  if (options && options.length) {
    options.forEach((option) => {
      let { name, aliases } = option
      let names = aliases ? aliases.concat(name) : [name]
      let matchingOption = findOneByNames(options, names)

      if (matchingOption && matchingOption !== option) {
        throw new Error(
          `Option "${name}" has a name or alias ` +
          `that is already taken by "${matchingOption.name}"`
        )
      }
    })
  }
}

function validateConfig(schema, config) {
  // ajv caches schemas by their ids effectively preventing us from using
  // multiple instances of appache with a single instance of ajv, so we bust
  // the cache on every config validation as a workaround.
  // TODO: we should use an ajv instance per appache instance and only clear
  // the cache when the schema changes
  ajv.removeSchema()
  let isValid = ajv.validate(schema, config)

  if (!isValid) {
    throw new Error(`The config doesn't match the schema:\n${ajv.errorsText()}`)
  }

  config.commands.forEach((command) => {
    command = populateCommand(config, command)
    validateCommand(command)
  })
}


module.exports = validateConfig
