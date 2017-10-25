const Lifecycle = require('./lifecycle')


const EVENTS = {
  schema: {
    mode: 'sync',
    tags: ['modifySchema', 'modifyConfigSchema', 'modifyOptionSchema'],
  },
  init: {
    mode: 'sync',
  },
  start: {
    mode: 'sync',
  },
  activate: {
    mode: 'sync',
  },
  deactivate: {
    mode: 'sync',
  },
  stop: {
    mode: 'sync',
  },
  config: {
    mode: 'sync',
    tags: [
      'modifyConfig', 'createCommandConfig', 'createOptionConfig',
      'modifyCommandConfig', 'modifyOptionConfig',
    ],
  },
  execute: {
    mode: 'async',
    tags: ['addCommand', 'modifyCommand', 'addOption', 'modifyOption'],
  },
  process: {
    mode: 'async',
    tags: ['modifyCommand', 'addOption', 'modifyOption'],
  },
  handle: {
    mode: 'async',
  },
  tap: {
    mode: 'async',
  },
  error: {
    mode: 'sync',
  },
}
const HOOTER_SETTINGS = {
  events: EVENTS,
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

  let lifecycle = new Lifecycle(HOOTER_SETTINGS)
  lifecycle.plug(corePlugins, CORE_PLUGIN_SETTINGS)
  lifecycle.plug(plugins, PLUGIN_SETTINGS)
  lifecycle.start()

  return lifecycle.toot('init')
}
