/* eslint-disable global-require */

const appache = require('./appache')
const pluginize = require('./pluginize')


const corePlugins = {
  config: require('./plugins/config'),
  error: require('./plugins/error'),
  execute: require('./plugins/execute'),
}
const defaultPlugins = {
}


module.exports = function appacheWithPlugins(userPlugins) {
  let plugins = pluginize(corePlugins, defaultPlugins, userPlugins)
  return appache(plugins)
}
