/* eslint-disable global-require */

const Lifecycle = require('./lifecycle')
const events = require('./events')
const corePlugins = [
  require('./init'),
  require('./schema'),
  require('./config'),
  require('./inherit'),
  require('./error'),
  require('./start'),
  require('./execute'),
  require('./api'),
]


const HOOTER_SETTINGS = { events }
const CORE_PLUGIN_SETTINGS = {
  required: true,
}
const PLUGIN_SETTINGS = {
  registeredEventsOnly: true,
  disallowedEvents: ['schema', 'config', 'process', 'handle'],
}


module.exports = function appacheCore(plugins) {
  if (plugins && !Array.isArray(plugins)) {
    throw new Error('Plugins must be an array of functions')
  }

  let lifecycle = new Lifecycle(HOOTER_SETTINGS)
  lifecycle.plug(corePlugins, CORE_PLUGIN_SETTINGS)
  lifecycle.plug(plugins, PLUGIN_SETTINGS)
  lifecycle.start()

  return lifecycle.toot('init')
}
