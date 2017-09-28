const { preHookStart } = require('hooter/effects')
const { findDefaultCommand } = require('../../common')


function setProcessTitle(schema, config) {
  let command = findDefaultCommand(config)

  if (command) {
    process.title = command.name
  }
}

module.exports = function* processTitlePlugin() {
  yield preHookStart('config', setProcessTitle)
}
