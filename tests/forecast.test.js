import test from 'node:test'
import assert from 'node:assert/strict'
import { interpolateForecast } from '../src/utils/forecast.js'

const first = { timestamp: 0, temp: 10, feelsLike: 8, humidity: 40, rain: 0, wind: 1, status: '맑음' }
const last = { timestamp: 3 * 3600000, temp: 16, feelsLike: 14, humidity: 70, rain: 90, wind: 4, status: '비' }

test('one-hour estimate interpolates numeric fields on the actual time interval', () => {
  const result = interpolateForecast([last, first], 3600000)
  assert.equal(result.temp, 12)
  assert.equal(result.feelsLike, 10)
  assert.equal(result.humidity, 50)
  assert.equal(result.rain, 30)
  assert.equal(result.wind, 2)
  assert.deepEqual(interpolateForecast([first, last], 0), first)
})

test('empty or out-of-horizon forecasts do not fabricate future predictions', () => {
  assert.equal(interpolateForecast([], 0), null)
  assert.equal(interpolateForecast([first, last], -1), null)
  assert.equal(interpolateForecast([first, last], last.timestamp + 1), null)
  assert.equal(interpolateForecast([first, last], NaN), null)
})
