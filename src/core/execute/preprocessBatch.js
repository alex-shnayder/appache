const {
  InputError, findByIds, findOneByNames, findCommandByFullName,
} = require('../common')


function canonizeFullName(config, fullName) {
  let allCommands = config.commands
  let commands = allCommands
  let newName = fullName.slice()

  for (let i = 0; i < fullName.length; i++) {
    let name = fullName[i]
    let command = findOneByNames(commands, name)

    if (!command) {
      return newName
    }

    newName[i] = command.name

    if (!command.commands) {
      return newName
    }

    commands = findByIds(allCommands, command.commands)
  }

  return newName
}

function doesFullNameBelongToBranch(fullName, branch) {
  if (fullName.length <= branch.length) {
    return false
  }

  for (let i = 0; i < branch.length; i++) {
    if (branch[i] !== fullName[i]) {
      return false
    }
  }

  return true
}

function createIntermediateCommands(config, branch, fullName) {
  let length = fullName.length - 1
  let commands = []

  for (let i = branch.length; i < length; i++) {
    let partialFullName = fullName.slice(0, i + 1)
    let commandConfig = findCommandByFullName(config, partialFullName, true)

    commands.push({
      fullName: partialFullName,
      inputName: partialFullName.join(' '),
      options: [],
      config: commandConfig,
      defined: Boolean(commandConfig),
    })
  }

  return commands
}

function transformOptions(options, optionConfigs) {
  let areOptionsArray = Array.isArray(options)

  if (!options) {
    options = []
  } else if (!areOptionsArray && typeof options === 'object') {
    options = Object.keys(options).map((name) => {
      let value = options[name]
      return { name, value }
    })
  } else if (!areOptionsArray) {
    throw new InputError(
      'The options of a command in a batch must be either an array or an object'
    )
  }

  return options.map((option) => {
    if (!option || typeof option !== 'object') {
      throw new InputError('An option of a command in a batch must be an object')
    }

    if (!option.name || typeof option.name !== 'string') {
      throw new InputError('An option of a command in a batch must have a name')
    }

    if (!optionConfigs || !optionConfigs.length) {
      return option
    }

    let optionConfig = findOneByNames(optionConfigs, option.name)
    let inputName = option.inputName || option.name
    return Object.assign({}, option, {
      inputName, config: optionConfig, defined: Boolean(optionConfig),
    })
  })
}

module.exports = function preprocessBatch(batch, config) {
  if (!Array.isArray(batch) || batch.length === 0) {
    throw new InputError('A batch must be an array of commands')
  }

  let result = []
  let branch = []

  for (let i = 0; i < batch.length; i++) {
    let command = batch[i]

    if (!command || typeof command !== 'object') {
      throw new InputError('Each command in a batch must be an object')
    }

    let { fullName, options } = command

    if (!fullName || !fullName.length) {
      throw new InputError('Each command in a batch must have a full name')
    }

    if (typeof fullName === 'string') {
      fullName = [fullName]
    } else if (!Array.isArray(fullName)) {
      throw new InputError('A command\'s fullName in a batch must be an array or a string')
    }

    fullName = canonizeFullName(config, fullName)

    if (branch && !doesFullNameBelongToBranch(fullName, branch)) {
      let err = new InputError('Commands in a batch must form a hierarchy')
      err.command = command
      throw err
    }

    if (fullName.length - branch.length > 1) {
      let fillerCommands = createIntermediateCommands(config, branch, fullName)
      result = result.concat(fillerCommands)
    }

    let commandConfig = findCommandByFullName(config, fullName, true)
    let optionConfigs = commandConfig && commandConfig.options

    command = Object.assign({}, command)
    command.fullName = fullName
    command.inputName = command.inputName || fullName.join(' ')
    command.config = commandConfig
    command.options = transformOptions(options, optionConfigs)
    command.defined = Boolean(commandConfig)

    branch = fullName
    result.push(command)
  }

  return result
}
