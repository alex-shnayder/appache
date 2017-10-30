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


function filterPlugins(plugins) {
  let disabledPlugins = {}

  plugins.forEach((plugin) => {
    if (typeof plugin === 'string' && plugin[0] === '-') {
      disabledPlugins[plugin.slice(1)] = true
    }
  })

  return plugins.filter((plugin) => {
    return typeof plugin === 'function' && !disabledPlugins[plugin.name]
  })
}

module.exports = function appache(corePlugins, plugins) {
  if (corePlugins && !Array.isArray(corePlugins)) {
    throw new Error('Core plugins must be an array of functions')
  }

  if (plugins && !Array.isArray(plugins)) {
    throw new Error('Plugins must be an array of functions')
  }

  plugins = filterPlugins(plugins)

  let lifecycle = new Lifecycle(HOOTER_SETTINGS)
  lifecycle.plug(corePlugins, CORE_PLUGIN_SETTINGS)
  lifecycle.plug(plugins, PLUGIN_SETTINGS)
  lifecycle.start()

  return lifecycle.toot('init')
}
