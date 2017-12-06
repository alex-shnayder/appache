/* eslint-disable global-require */

const Lifecycle = require('./lifecycle')
const events = require('./events')
const corePlugins = [
  require('./plugins/init'),
  require('./plugins/schema'),
  require('./plugins/config'),
  require('./plugins/inherit'),
  require('./plugins/error'),
  require('./plugins/start'),
  require('./plugins/execute'),
  require('./plugins/identify'),
  require('./plugins/api'),
  require('./plugins/restrict'),
]


const HOOTER_SETTINGS = { events }
const CORE_PLUGIN_SETTINGS = {
  required: true,
}
const PLUGIN_SETTINGS = {
  registeredEventsOnly: true,
  disallowedEvents: ['schematize', 'configure', 'process', 'dispatch'],
}


module.exports = function appacheCore(plugins) {
  if (plugins && !Array.isArray(plugins)) {
    throw new Error('Plugins must be an array of functions')
  }

  let lifecycle = new Lifecycle(HOOTER_SETTINGS)
  lifecycle.plug(corePlugins, CORE_PLUGIN_SETTINGS)
  lifecycle.plug(plugins, PLUGIN_SETTINGS)
  lifecycle.start()

  return lifecycle.toot('initialize')
}
