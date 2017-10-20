const { preHook, call } = require('hooter/effects')


function canonize(command) {
  let { options } = command

  if (options && options.length) {
    command = Object.assign({}, command)
    command.options = options.map((option) => {
      if (!option.config) {
        return option
      }

      option = Object.assign({}, option)
      option.name = option.config.name
      return option
    })
  }

  return command
}

function* processHandler(config, command, ...args) {
  command = yield call(canonize, command)
  return [config, command, ...args]
}

module.exports = function* canonize() {
  yield preHook({
    event: 'process',
    tags: ['modifyCommand', 'modifyOption'],
  }, processHandler)
}
