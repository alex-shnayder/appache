const { next, hook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const validateCommandOptions = require('./validateCommandOptions')


module.exports = function* requirePlugin() {
  yield hook('schema', function* (schema) {
    schema = modifySchema(schema)
    return yield next(schema)
  })

  yield hook('process', function* (config, command) {
    if (command.config) {
      validateCommandOptions(command)
    }

    return yield next(config, command)
  })
}
