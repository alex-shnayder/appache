const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const validateCommand = require('./validateCommand')


module.exports = function* validate() {
  yield preHook({
    event: 'schema',
    tags: ['modifySchema', 'modifyOptionSchema'],
  }, (schema) => {
    schema = modifySchema(schema)
    return [schema]
  })

  yield preHook({
    event: 'process',
    goesAfter: ['modifyOption'],
  }, (_, command) => {
    validateCommand(command)
  })
}
