const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')
const shareOptions = require('./shareOptions')


module.exports = function* share() {
  yield preHook({
    event: 'schematize',
    tags: ['modifyCommandSchema'],
  }, (schema) => {
    schema = modifySchema(schema)
    return [schema]
  })

  yield preHook({
    event: 'execute',
    tags: ['modifyCommand', 'modifyOption'],
    goesAfter: ['identify'],
  }, (_, batch) => {
    batch = shareOptions(batch)
    return [_, batch]
  })
}
