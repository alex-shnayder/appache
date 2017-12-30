const { preHook } = require('hooter/effects')
const addAliasesToConfig = require('./addAliasesToConfig')


function handler(schema, config) {
  config = addAliasesToConfig(config)
  return [schema, config]
}


module.exports = function* alias() {
  yield preHook({
    event: 'configure',
    tags: ['modifyCommandConfig', 'modifyOptionConfig'],
    goesAfter: ['modifyConfig'],
  }, handler)
}
