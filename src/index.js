/* eslint-disable global-require */

const appache = require('./appache')
const pluginize = require('./pluginize')


const corePlugins = {
  init: require('./plugins/init'),
  schema: require('./plugins/schema'),
  config: require('./plugins/config'),
  inherit: require('./plugins/inherit'),
  error: require('./plugins/error'),
  start: require('./plugins/start'),
  execute: require('./plugins/execute'),
}
const defaultPlugins = {
  version: require('./plugins/version'),
  help: require('./plugins/help'),
  restrict: require('./plugins/restrict'),
  require: require('./plugins/require'),
  coerce: require('./plugins/coerce'),
  validate: require('./plugins/validate'),
  types: require('./plugins/types'),
  camelize: require('./plugins/camelize'),
  canonize: require('./plugins/canonize'),
  defaultValues: require('./plugins/defaultValues'),
  processTitle: require('./plugins/processTitle'),
  api: require('./plugins/api'),
}


module.exports = function appacheWithPlugins(userPlugins) {
  let plugins = pluginize(corePlugins, defaultPlugins, userPlugins)
  return appache(plugins)
}
