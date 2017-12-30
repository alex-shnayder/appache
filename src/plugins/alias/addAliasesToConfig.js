const camelcase = require('camelcase')


function addAliasesToItem(item) {
  let { name, aliases } = item
  let altName = camelcase(name)
  let hiddenNames = (altName === name) ? [] : [altName]
  let newAliases = aliases ? aliases.concat(hiddenNames) : hiddenNames.slice()

  if (aliases && aliases.length) {
    aliases.forEach((alias) => {
      let newAlias = camelcase(alias)

      if (newAlias !== name && !newAliases.includes(newAlias)) {
        hiddenNames.push(newAlias)
        newAliases.push(newAlias)
      }
    })
  }

  item = Object.assign({}, item)
  item.aliases = newAliases
  item.hiddenNames = hiddenNames
  return item
}

module.exports = function addAliasesToConfig(config) {
  let { commands, options } = config
  commands = commands.map(addAliasesToItem)
  options = options && options.map(addAliasesToItem)
  return Object.assign({}, config, { commands, options })
}
