const assert = require('assert')
const setProcessTitle = require('./setProcessTitle')
const { handler } = require('./index?private')
const plugin = require('./index')


describe('processTitle plugin', () => {
  describe('plugin', () => {
    it('hooks the handler', () => {
      let generator = plugin()
      let { value } = generator.next()

      assert.deepStrictEqual(value, {
        effect: 'hook',
        event: 'configure',
        priority: 'end',
        fn: handler,
        routineMode: 'post',
      })
    })
  })

  describe('handler', () => {
    let config = {}
    let generator = handler(config)

    it('calls setProcessTitle', () => {
      let { value } = generator.next()

      assert.deepStrictEqual(value, {
        effect: 'call',
        fn: setProcessTitle,
        args: [config],
      })
    })

    it('returns the config', () => {
      let { value, done } = generator.next()

      assert(value === config)
      assert(done)
    })
  })

  describe('setProcessTitle', () => {
    it('sets the process title to the name of the default root command', () => {
      let config = {
        commands: [{
          name: 'foo',
          id: 'foo',
          default: true,
        }, {
          name: 'bar',
          root: true,
          commands: ['foo'],
        }, {
          name: 'baz',
          root: true,
          default: true,
        }],
      }

      let originalTitle = process.title
      setProcessTitle(config)
      assert(process.title === 'baz')
      process.title = originalTitle
    })

    it('doesn\'t do anything if there is no default root command', () => {
      let config = {
        commands: [{
          name: 'foo',
          id: 'foo',
          default: true,
        }, {
          name: 'bar',
          commands: ['foo'],
        }],
      }

      let originalTitle = process.title
      process.title = 'baz'
      setProcessTitle(config)
      assert(process.title === 'baz')
      process.title = originalTitle
    })
  })
})
