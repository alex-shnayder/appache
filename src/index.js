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
  require: require('./plugins/require'),
  coerce: require('./plugins/coerce'),
  validate: require('./plugins/validate'),
  types: require('./plugins/types'),
  canonize: require('./plugins/canonize'),
  camelize: require('./plugins/camelize'),
  defaultValues: require('./plugins/defaultValues'),
  processTitle: require('./plugins/processTitle'),
}


module.exports = function appacheWithPlugins(userPlugins) {
  let plugins = pluginize(corePlugins, defaultPlugins, userPlugins)
  return appache(plugins)
}
