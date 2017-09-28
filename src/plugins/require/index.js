const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const validateCommandOptions = require('./validateCommandOptions')


module.exports = function* requirePlugin() {
  yield preHook('schema', (schema) => {
    schema = modifySchema(schema)
    return [schema]
  })

  yield preHook('process', (config, command) => {
    if (command.config) {
      validateCommandOptions(command)
    }
  })
}
