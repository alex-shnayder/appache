const assert = require('assert')
const { setProcessTitle } = require('./index?private')
const processTitlePlugin = require('./index')


describe('processTitle plugin', () => {
  it('hooks the config handler', () => {
    let generator = processTitlePlugin()
    let { value } = generator.next()

    assert.deepStrictEqual(value, {
      effect: 'hook',
      event: 'config',
      priority: 'end',
      fn: setProcessTitle,
      routineMode: 'post',
    })
  })

  describe('setProcessTitle', () => {
    it('sets the process title to the name of the default command if it exists', () => {
      let config = {
        commands: [{
          name: 'foo',
        }, {
          name: 'bar',
          default: true,
        }, {
          name: 'baz',
        }],
      }

      let originalTitle = process.title
      setProcessTitle(config)
      assert(process.title === 'bar')
      process.title = originalTitle
    })

    it('doesn\'t do anything if there is no default command', () => {
      let config = {
        commands: [{
          name: 'foo',
        }, {
          name: 'bar',
        }],
      }

      let originalTitle = process.title
      process.title = 'baz'
      setProcessTitle(config)
      assert(process.title === 'baz')
      process.title = originalTitle
    })

    it('returns the config', () => {
      let config = {}
      let result = setProcessTitle(config)

      assert(result === config)
    })
  })
})
