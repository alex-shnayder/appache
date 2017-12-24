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

function* handler(config, batch) {
  let newBatch = []

  for (let i = 0; i < batch.length; i++) {
    newBatch[i] = yield call(canonize, batch[i])
  }

  return [config, newBatch]
}

module.exports = function* canonize() {
  yield preHook({
    event: 'execute',
    tags: ['modifyOption'],
  }, handler)
}
