const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const validateCommand = require('./validateCommand')


module.exports = function* validatePlugin() {
  yield preHook('schema', (schema) => {
    schema = modifySchema(schema)
    return [schema]
  })

  yield preHook('process', (_, command) => {
    validateCommand(command)
  })
}
