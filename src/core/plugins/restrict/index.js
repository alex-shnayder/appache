const { preHook } = require('hooter/effects')
const { InputError } = require('../../common')
const modifySchema = require('./modifySchema')
const handleUndefinedCommand = require('./handleUndefinedCommand')


function validateCommand(config, parent, command) {
  let { options, config: cmdConfig } = command

  if (!cmdConfig) {
    return handleUndefinedCommand(config, parent, command)
  }

  if (cmdConfig.strict) {
    let undefinedOption = options.find((option) => !option.config)

    if (undefinedOption) {
      let e = new InputError(`Undefined option "${undefinedOption.inputName}"`)
      e.command = command
      throw e
    }
  }
}

function validateBatch(config, batch) {
  batch.reduce((parent, command) => {
    validateCommand(config, parent, command)
    return command
  }, null)
}

module.exports = function* restrict() {
  yield preHook({
    event: 'schematize',
    tags: ['modifyCommandSchema'],
  }, (schema) => {
    schema = modifySchema(schema)
    return [schema]
  })

  yield preHook({
    event: 'execute',
    goesAfter: ['assignCommandConfig', 'assignOptionConfig'],
    goesBefore: ['process'],
  }, validateBatch)
}
