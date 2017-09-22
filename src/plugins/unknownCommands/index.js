const { next, hook } = require('hooter/effects')
const handleUnknownCommand = require('./handleUnknownCommand')


module.exports = function* unknownCommandsPlugin() {
  yield hook('process', function* (config, command) {
    if (!command.config) {
      handleUnknownCommand(config, command)
    }

    return yield next(config, command)
  })
}
