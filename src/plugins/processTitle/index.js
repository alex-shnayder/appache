const { postHookEnd } = require('hooter/effects')
const { findDefaultCommand } = require('../../core/common')


function setProcessTitle(config) {
  let command = findDefaultCommand(config)

  if (command) {
    process.title = command.name
  }

  return config
}

module.exports = function* processTitle() {
  yield postHookEnd('configure', setProcessTitle)
}
