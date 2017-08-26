const Hooter = require('hooter')
const { next } = require('hooter/effects')
const baseSchema = require('./schema')
const configPlugin = require('./plugins/config')
const errorPlugin = require('./plugins/error')
const executePlugin = require('./plugins/execute')


const EVENTS = [
  ['schema', 'sync'],
  ['init', 'sync'],
  ['start', 'sync'],
  ['config', 'sync'],
  ['execute', 'async'],
  ['process', 'async'],
  ['handle', 'async'],
  ['tap', 'async'],
  ['error', 'sync'],
]
const CORE_PLUGINS = [
  configPlugin, errorPlugin, executePlugin,
]


module.exports = function appache(plugins) {
  let lifecycle = new Hooter()

  if (plugins && !Array.isArray(plugins)) {
    throw new Error('Plugins must be an array of functions')
  }

  plugins = plugins ? CORE_PLUGINS.concat(plugins) : CORE_PLUGINS

  EVENTS.forEach(([event, mode]) => {
    lifecycle.register(event, mode)
  })

  lifecycle.hookStart('init', function* () {
    let schema = lifecycle.tootWith('schema', (schema) => schema, baseSchema)
    return yield next(schema)
  })

  plugins.forEach((plugin) => {
    let boundLifecycle = lifecycle.bind(plugin)
    plugin = boundLifecycle.wrap(plugin)
    plugin(boundLifecycle)
  })

  return lifecycle.tootWith('init', (schema, result) => result)
}
