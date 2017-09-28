const { preHook } = require('hooter/effects')
const handleUnknownCommand = require('./handleUnknownCommand')


module.exports = function* unknownCommandsPlugin() {
  yield preHook('process', (config, command) => {
    if (!command.config) {
      handleUnknownCommand(config, command)
    }
  })
}
