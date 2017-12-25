const { preHook } = require('hooter/effects')
const { validateCommands, validateOptions } = require('./validate')


module.exports = function* restrict() {
  yield preHook({
    event: 'execute',
    goesAfter: ['identifyCommand'],
    goesBefore: ['identifyOption'],
  }, validateCommands)

  yield preHook({
    event: 'execute',
    goesAfter: ['identifyOption'],
    goesBefore: ['handleBatch'],
  }, validateOptions)
}
