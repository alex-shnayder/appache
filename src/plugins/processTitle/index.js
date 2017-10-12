const { postHookEnd } = require('hooter/effects')
const { findDefaultCommand } = require('../../common')


function setProcessTitle(config) {
  let command = findDefaultCommand(config)

  if (command) {
    process.title = command.name
  }

  return config
}

module.exports = function* processTitle() {
  yield postHookEnd('config', setProcessTitle)
}
