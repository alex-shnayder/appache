const hooterEffects = require('hooter/effects')
const events = require('./events')


Object.assign(exports, hooterEffects)

// Add shortcut effects for tooting events
// e.g. execute(...args) for toot('execute', ...args)
Object.keys(events).forEach((event) => {
  exports[event] = function tootEvent(...args) {
    return hooterEffects.toot(event, ...args)
  }
})
