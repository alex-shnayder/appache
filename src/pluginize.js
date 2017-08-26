/*
  Core plugins are always included.
  An item in the array can be:
  - A function (a plugin itself)
  - `false` to exclude the default plugins
  - `true` to include the default plugins
  - A string with the name of a default plugin to include
  - A string prefixed with a '-' with the name of a default plugin to exclude
*/

module.exports = function pluginize(corePlugins, defaultPlugins, userPlugins) {
  if (
    corePlugins &&
    (typeof corePlugins !== 'object' || Array.isArray(corePlugins))
  ) {
    throw new Error('Core plugins must be a non-array object')
  }

  if (
    defaultPlugins &&
    (typeof defaultPlugins !== 'object' || Array.isArray(defaultPlugins))
  ) {
    throw new Error('Default plugins must be a non-array object')
  }

  if (userPlugins && !Array.isArray(userPlugins)) {
    throw new Error('User plugins must be an array')
  }

  let plugins = corePlugins ? Object.values(corePlugins) : []

  if (defaultPlugins) {
    plugins = plugins.concat(Object.values(defaultPlugins))
  }

  userPlugins && userPlugins.forEach((item) => {
    let remove = false
    let plugin = item

    if (item === false) {
      plugins = plugins.filter((plugin) => {
        return !defaultPlugins.includes(plugin)
      })
      return
    } else if (item === true) {
      plugins = plugins.concat(
        defaultPlugins.filter((plugin) => {
          return !plugins.includes(plugin)
        })
      )
      return
    }

    if (typeof item === 'string') {
      remove = false

      if (item[0] === '-') {
        remove = true
        item = item.substr(1)
      }

      plugin = defaultPlugins[item]

      if (!plugin) {
        throw new Error(`Plugin "${item}" is unknown`)
      }
    }

    if (typeof plugin !== 'function') {
      throw new Error('A plugin must be a function')
    }

    if (remove) {
      plugins = plugins.filter((p) => p !== plugin)
    } else {
      plugins.push(plugin)
    }
  })

  return plugins
}
