const { preHookStart, hookEnd, schematize } = require('../../effects')


function* schematizeHandler() {
  let schema = yield schematize()
  return [schema]
}

function resultHandler(schema, result) {
  return result
}


module.exports = function* initialize() {
  yield preHookStart('initialize', schematizeHandler)
  yield hookEnd('initialize', resultHandler)
}
