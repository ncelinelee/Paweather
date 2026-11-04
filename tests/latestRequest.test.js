import test from 'node:test'
import assert from 'node:assert/strict'
import { createLatestRequest } from '../src/utils/latestRequest.js'

test('an older response resolving last cannot overwrite a newer result', async () => {
  const requests = createLatestRequest()
  let finishOld
  let value = null
  const oldResult = new Promise((resolve) => { finishOld = resolve })
  const load = async (promise) => {
    const token = requests.start()
    const result = await promise
    if (requests.isCurrent(token)) value = result
  }
  const oldTask = load(oldResult)
  await load(Promise.resolve('new location'))
  finishOld('old location')
  await oldTask
  assert.equal(value, 'new location')
})

test('reset or disposal makes an in-flight result stale even without another request', () => {
  const requests = createLatestRequest()
  const token = requests.start()
  requests.invalidate()
  assert.equal(requests.isCurrent(token), false)
})
