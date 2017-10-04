const Hooter = require('hooter')


const HOOTER_SETTINGS = {
  events: {
    schema: { mode: 'sync' },
    init: { mode: 'sync' },
    start: { mode: 'sync' },
    activate: { mode: 'sync' },
    deactivate: { mode: 'sync' },
    stop: { mode: 'sync' },
    config: { mode: 'sync' },
    execute: { mode: 'async' },
    process: { mode: 'async' },
    handle: { mode: 'async' },
    tap: { mode: 'async' },
    error: { mode: 'sync' },
  },
}
const CORE_PLUGIN_SETTINGS = {
  required: true,
}
const PLUGIN_SETTINGS = {
  registeredEventsOnly: true,
  disallowedEvents: ['schema', 'config', 'process', 'handle', 'tap'],
}


module.exports = function appache(corePlugins, plugins) {
  if (corePlugins && !Array.isArray(corePlugins)) {
    throw new Error('Core plugins must be an array of functions')
  }

  if (plugins && !Array.isArray(plugins)) {
    throw new Error('Plugins must be an array of functions')
  }

  let lifecycle = new Hooter(HOOTER_SETTINGS)
  lifecycle.plug(corePlugins, CORE_PLUGIN_SETTINGS)
  lifecycle.plug(plugins, PLUGIN_SETTINGS)
  lifecycle.start()

  return lifecycle.toot('init')
}
