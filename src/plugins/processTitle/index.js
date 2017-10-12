const { postHookEnd } = require('hooter/effects')
const { findRootCommands } = require('../../common')


function setProcessTitle(config) {
  let commands = findRootCommands(config)

  if (commands.length === 1) {
    process.title = commands[0].name
  }

  return config
}

module.exports = function* processTitle() {
  yield postHookEnd('config', setProcessTitle)
}
