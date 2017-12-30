const camelcase = require('camelcase')


module.exports = function camelizeBatchOptions(command) {
  if (command.options) {
    command = Object.assign({}, command)
    command.options = command.options.map((option) => {
      option = Object.assign({}, option)
      option.name = camelcase(option.name)
      return option
    })
  }

  return command
}
