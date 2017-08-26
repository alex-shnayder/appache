const Hooter = require('hooter')
const { next } = require('hooter/effects')
const baseSchema = require('./schema')


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


module.exports = function appache(plugins) {
  let lifecycle = new Hooter()

  if (plugins && !Array.isArray(plugins)) {
    throw new Error('Plugins must be an array of functions')
  }

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
