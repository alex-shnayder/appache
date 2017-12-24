const camelcase = require('camelcase')
const { preHook, call } = require('hooter/effects')


function camelizeOptions(command) {
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

function* handler(config, batch) {
  let newBatch = []

  for (let i = 0; i < batch.length; i++) {
    newBatch[i] = yield call(camelizeOptions, batch[i])
  }

  return [config, newBatch]
}

module.exports = function* camelize() {
  yield preHook({
    event: 'execute',
    tags: ['modifyOption'],
    goesAfter: ['modifyOption'],
  }, handler)
}
