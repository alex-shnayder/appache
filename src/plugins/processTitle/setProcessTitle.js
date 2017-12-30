const { findDefaultCommand } = require('../../core/common')


module.exports = function setProcessTitle(config) {
  let command = findDefaultCommand(config)

  if (command) {
    process.title = command.name
  }
}
