const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const validateCommand = require('./validateCommand')


module.exports = function* validate() {
  yield preHook('schema', (schema) => {
    schema = modifySchema(schema)
    return [schema]
  })

  yield preHook({
    event: 'process',
    goesAfter: ['defaultValues'],
  }, (_, command) => {
    validateCommand(command)
  })
}
