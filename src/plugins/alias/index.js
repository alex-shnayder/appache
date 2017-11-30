const { preHook } = require('hooter/effects')
const camelcase = require('camelcase')


function addAliases(item) {
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

function addAliasesToConfig(config) {
  let { commands, options } = config
  commands = commands.map(addAliases)
  options = options && options.map(addAliases)
  return Object.assign({}, config, { commands, options })
}

module.exports = function* alias() {
  yield preHook({
    event: 'config',
    tags: ['modifyCommandConfig', 'modifyOptionConfig'],
    goesAfter: ['modifyConfig'],
  }, (schema, config) => {
    config = addAliasesToConfig(config)
    return [schema, config]
  })
}
