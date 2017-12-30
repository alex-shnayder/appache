const { preHook, call } = require('hooter/effects')
const canonizeBatchOptions = require('./canonizeBatchOptions')


function* handler(config, batch) {
  let newBatch = []

  for (let i = 0; i < batch.length; i++) {
    newBatch[i] = yield call(canonizeBatchOptions, batch[i])
  }

  return [config, newBatch]
}


module.exports = function* canonize() {
  yield preHook({
    event: 'execute',
    tags: ['modifyOption'],
  }, handler)
}
