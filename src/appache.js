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


module.exports = function appache(plugins) {
  let lifecycle = new Hooter(HOOTER_SETTINGS)

  if (plugins && !Array.isArray(plugins)) {
    throw new Error('Plugins must be an array of functions')
  }

  lifecycle
    .plug(plugins)
    .forEach((plugin) => plugin())

  return lifecycle.toot('init')
}
