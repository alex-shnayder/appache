const { InputError } = require('../../common')


function normalizeOption(option) {
  if (!option || typeof option !== 'object') {
    throw new InputError('An option of a command in a batch must be an object')
  }

  option = Object.assign({}, option)
  option.inputName = option.inputName || option.name
  return option
}

function normalizeOptions(options) {
  if (!options) {
    return []
  }

  if (!Array.isArray(options)) {
    if (typeof options === 'object') {
      options = Object.keys(options).map((name) => {
        return { name, value: options[name] }
      })
    } else {
      throw new InputError(
        'The options of a command in a batch must be either an array or an object'
      )
    }
  }

  return options.map(normalizeOption)
}

function normalizeCommand(command) {
  if (!command || typeof command !== 'object') {
    throw new InputError('Each command in a batch must be an object')
  }

  command = Object.assign({}, command)
  command.inputName = command.inputName || command.name
  command.options = normalizeOptions(command.options)
  return command
}

module.exports = function normalizeBatch(batch) {
  if (!Array.isArray(batch) || batch.length === 0) {
    throw new InputError('A batch must be an array of commands')
  }

  return batch.map(normalizeCommand)
}
