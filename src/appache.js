const Hooter = require('hooter')


const EVENTS = [
  ['schema', 'sync'],
  ['init', 'sync'],
  ['start', 'sync'],
  ['activate', 'sync'],
  ['deactivate', 'sync'],
  ['stop', 'sync'],
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

  plugins.forEach((plugin) => {
    let boundLifecycle = lifecycle.bind(plugin)
    plugin = boundLifecycle.wrap(plugin)
    plugin(boundLifecycle)
  })

  return lifecycle.toot('init')
}
