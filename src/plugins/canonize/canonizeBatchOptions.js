module.exports = function canonizeBatchOptions(command) {
  let { options } = command

  if (options && options.length) {
    command = Object.assign({}, command)
    command.options = options.map((option) => {
      if (!option.config) {
        return option
      }

      option = Object.assign({}, option)
      option.name = option.config.name || option.name
      return option
    })
  }

  return command
}
