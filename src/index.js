/* eslint-disable global-require */

const appache = require('./appache')
const corePlugins = [
  require('./plugins/init'),
  require('./plugins/schema'),
  require('./plugins/config'),
  require('./plugins/inherit'),
  require('./plugins/error'),
  require('./plugins/start'),
  require('./plugins/execute'),
]
const defaultPlugins = [
  require('./plugins/version'),
  require('./plugins/help'),
  require('./plugins/restrict'),
  require('./plugins/require'),
  require('./plugins/coerce'),
  require('./plugins/validate'),
  require('./plugins/basicTypes'),
  require('./plugins/camelize'),
  require('./plugins/canonize'),
  require('./plugins/defaultValues'),
  require('./plugins/processTitle'),
  require('./plugins/api'),
]


module.exports = function appacheWithPlugins(plugins) {
  if (plugins && !Array.isArray(plugins)) {
    throw new Error('Plugins must be an array of functions')
  }

  plugins = plugins ? defaultPlugins.concat(plugins) : defaultPlugins
  return appache(corePlugins, plugins)
}
