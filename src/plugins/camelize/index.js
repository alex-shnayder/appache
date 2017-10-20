const camelcase = require('camelcase')
const { preHook, call } = require('hooter/effects')


function camelizeOptions(command) {
  if (!command.options) {
    return command
  }

  command = Object.assign({}, command)
  command.options = command.options.map((option) => {
    option = Object.assign({}, option)
    option.name = camelcase(option.name)
    return option
  })

  return command
}

function* processHandler(_, command, ...args) {
  command = yield call(camelizeOptions, command)
  return [_, command, ...args]
}

module.exports = function* camelize() {
  yield preHook({
    event: 'process',
    tags: ['modifyCommand', 'modifyOption'],
    goesAfter: ['modifyOption'],
  }, processHandler)
}
