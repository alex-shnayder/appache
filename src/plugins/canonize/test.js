const assert = require('assert')
const canonizeBatchOptions = require('./canonizeBatchOptions')
const { handler } = require('./index?private')
const canonizePlugin = require('./index')


describe('canonize plugin', () => {
  it('hooks the handler', () => {
    let generator = canonizePlugin()
    let { value } = generator.next()

    assert.deepStrictEqual(value, {
      effect: 'hook',
      event: {
        event: 'execute',
        tags: ['modifyOption'],
      },
      fn: handler,
      routineMode: 'pre',
    })
  })

  describe('handler', () => {
    let config = {}
    let batch = [{}, {}]
    let resultBatch = [{}, {}]
    let generator = handler(config, batch)

    it('calls canonizeBatchOptions for each command in the batch', () => {
      let { value } = generator.next()

      assert.deepStrictEqual(value, {
        effect: 'call',
        fn: canonizeBatchOptions,
        args: [batch[0]],
      })

      value = generator.next(resultBatch[0]).value

      assert.deepStrictEqual(value, {
        effect: 'call',
        fn: canonizeBatchOptions,
        args: [batch[1]],
      })
    })

    it('returns modified args', () => {
      let result = [config, resultBatch]
      let { value, done } = generator.next(resultBatch[1])

      assert.deepStrictEqual(value, result)
      assert(done)
    })
  })

  describe('canonizeBatchOptions', () => {
    it('sets the names of the command\'s options to the names defined in their configs', () => {
      let command = {
        fullName: [],
        options: [{
          name: 'foo',
          config: {
            name: 'oof',
          },
        }, {
          name: 'bar',
        }],
      }
      let result = canonizeBatchOptions(command)

      assert.deepStrictEqual(result, {
        fullName: [],
        options: [{
          name: 'oof',
          config: {
            name: 'oof',
          },
        }, {
          name: 'bar',
        }],
      })
    })
  })
})
