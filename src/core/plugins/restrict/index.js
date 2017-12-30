const { preHook } = require('hooter/effects')
const { validateCommands, validateOptions } = require('./validate')


function validateCommandsHandler(config, batch) {
  validateCommands(config, batch)
}

function validateOptionsHandler(config, batch) {
  validateOptions(config, batch)
}


module.exports = function* restrict() {
  yield preHook({
    event: 'execute',
    goesAfter: ['identifyCommand'],
    goesBefore: ['identifyOption'],
  }, validateCommandsHandler)

  yield preHook({
    event: 'execute',
    goesAfter: ['identifyOption'],
    goesBefore: ['handleBatch'],
  }, validateOptionsHandler)
}
