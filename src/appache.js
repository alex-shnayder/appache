const Lifecycle = require('./lifecycle')
const events = require('./events')


const HOOTER_SETTINGS = { events }
const CORE_PLUGIN_SETTINGS = {
  required: true,
}
const PLUGIN_SETTINGS = {
  registeredEventsOnly: true,
  disallowedEvents: ['schema', 'config', 'process', 'handle'],
}


module.exports = function appache(corePlugins, plugins) {
  if (corePlugins && !Array.isArray(corePlugins)) {
    throw new Error('Core plugins must be an array of functions')
  }

  if (plugins && !Array.isArray(plugins)) {
    throw new Error('Plugins must be an array of functions')
  }

  let lifecycle = new Lifecycle(HOOTER_SETTINGS)
  lifecycle.plug(corePlugins, CORE_PLUGIN_SETTINGS)
  lifecycle.plug(plugins, PLUGIN_SETTINGS)
  lifecycle.start()

  return lifecycle.toot('init')
}
