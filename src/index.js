/* eslint-disable global-require */

const core = require('./core')
const defaultPlugins = [
  require('./plugins/deduplicate'),
  require('./plugins/alias'),
  require('./plugins/require'),
  require('./plugins/coerce'),
  require('./plugins/validate'),
  require('./plugins/basicTypes'),
  require('./plugins/camelize'),
  require('./plugins/canonize'),
  require('./plugins/defaultValues'),
  require('./plugins/processTitle'),
  require('./plugins/abstractCommands'),
]


module.exports = function appache(plugins) {
  if (plugins && !Array.isArray(plugins)) {
    throw new Error('Plugins must be an array of functions')
  }

  plugins = plugins ? defaultPlugins.concat(plugins) : defaultPlugins
  return core(plugins)
}
