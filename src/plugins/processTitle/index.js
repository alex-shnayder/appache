const { postHookEnd } = require('hooter/effects')
const { findDefaultRootCommand } = require('../../core/common')


function setProcessTitle(config) {
  let command = findDefaultRootCommand(config)

  if (command) {
    process.title = command.name
  }

  return config
}

module.exports = function* processTitle() {
  yield postHookEnd('config', setProcessTitle)
}
