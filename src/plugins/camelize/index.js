const { preHook, call } = require('hooter/effects')
const camelizeBatchOptions = require('./camelizeBatchOptions')


function* handler(config, batch) {
  let newBatch = []

  for (let i = 0; i < batch.length; i++) {
    newBatch[i] = yield call(camelizeBatchOptions, batch[i])
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
