import test from 'node:test'
import assert from 'node:assert/strict'
import { effectScope, ref } from 'vue'
import { usePlaceSearch } from '../src/composables/usePlaceSearch.js'

const deferred = () => {
  let resolve
  const promise = new Promise((done) => { resolve = done })
  return { promise, resolve }
}

const fixture = (searchPlaces) => {
  const scope = effectScope()
  const online = ref(true)
  const selected = []
  const search = scope.run(() => usePlaceSearch({
    language: ref('ko'), isOnline: online, selectedCityInfo: ref(null), searchPlaces,
    onSelect: async (location) => selected.push(location),
    onClear: () => {}, onQueryChanged: () => {}, readableError: (_error, message) => message
  }))
  return { scope, search, online, selected }
}

test('actual search state ignores an old location response arriving after a newer query', async () => {
  const old = deferred()
  const current = deferred()
  const { scope, search } = fixture((query) => query === '울산역' ? old.promise : current.promise)
  try {
    search.searchQuery.value = '울산역'
    const first = search.runAreaSearch()
    search.searchQuery.value = '울산대공원'
    const second = search.runAreaSearch()
    current.resolve([{ name: '울산대공원' }])
    await second
    old.resolve([{ name: '울산역' }])
    await first
    assert.deepEqual(search.searchSuggestions.value, [{ name: '울산대공원' }])
    assert.equal(search.searchLoading.value, false)
  } finally { scope.stop() }
})

test('reset prevents an in-flight auto-selection from reopening the old result', async () => {
  const response = deferred()
  const { scope, search, selected } = fixture(() => response.promise)
  try {
    search.searchQuery.value = '울산역'
    const task = search.searchWeather()
    search.resetSearch()
    response.resolve([{ name: '울산역' }])
    await task
    assert.deepEqual(selected, [])
    assert.deepEqual(search.searchSuggestions.value, [])
    assert.equal(search.searchQuery.value, '')
  } finally { scope.stop() }
})

test('offline search reports the state without issuing an external request', async () => {
  let calls = 0
  const { scope, search, online } = fixture(async () => { calls += 1; return [] })
  try {
    online.value = false
    search.searchQuery.value = '울산역'
    await search.searchWeather()
    assert.equal(calls, 0)
    assert.match(search.searchMessage.value, /오프라인/)
    assert.equal(search.searchLoading.value, false)
  } finally { scope.stop() }
})

test('going offline during an existing search clears loading and ignores its late response', async () => {
  const response = deferred()
  const { scope, search, online } = fixture(() => response.promise)
  try {
    search.searchQuery.value = '울산역'
    const pending = search.runAreaSearch()
    assert.equal(search.searchLoading.value, true)
    online.value = false
    await search.runAreaSearch()
    assert.equal(search.searchLoading.value, false)
    response.resolve([{ name: '울산역' }])
    await pending
    assert.deepEqual(search.searchSuggestions.value, [])
  } finally { scope.stop() }
})
