const { postHookEnd, call } = require('hooter/effects')
const setProcessTitle = require('./setProcessTitle')


function* handler(config) {
  yield call(setProcessTitle, config)
  return config
}


module.exports = function* processTitle() {
  yield postHookEnd('configure', handler)
}
