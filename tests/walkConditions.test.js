import test from 'node:test'
import assert from 'node:assert/strict'
import { classifyWalkConditions, getAgeInYears, getEnvironmentalFeelsLike } from '../src/utils/walkConditions.js'

const adult = { name: 'Test', age: 3, size: '중형견' }
const weather = { temp: 20, humidity: 30, wind: 0, aqi: 1, status: '맑음' }

test('temperature boundaries preserve the four product heuristic levels', () => {
  for (const [temp, level] of [[25, '안전'], [26, '가벼운 산책 가능'], [30, '주의'], [34, '위험'], [7, '가벼운 산책 가능'], [0, '주의'], [-10, '위험']]) {
    assert.equal(classifyWalkConditions({ ...weather, temp }, adult).level, level)
  }
})

test('month conversion affects puppy classification and vulnerability is capped at one step', () => {
  const puppy = { ...adult, age: getAgeInYears(11, 'months'), size: '대형견' }
  assert.equal(puppy.age, 11 / 12)
  const result = classifyWalkConditions({ ...weather, temp: 30 }, puppy)
  assert.equal(result.level, '위험')
  assert.deepEqual(result.reasons, ['puppy', 'largeHeat'])
  assert.equal(classifyWalkConditions({ ...weather, temp: 34 }, puppy).level, '위험')
  assert.equal(classifyWalkConditions(weather, puppy).level, '안전')
})

test('storm and very poor air quality override mild temperature', () => {
  assert.equal(classifyWalkConditions({ ...weather, status: '뇌우' }, adult).level, '위험')
  assert.equal(classifyWalkConditions({ ...weather, aqi: 5 }, adult).level, '위험')
  assert.equal(classifyWalkConditions({ ...weather, status: '비' }, adult).level, '가벼운 산책 가능')
})

test('wind chill and heat index keep the calculation in Celsius', () => {
  assert.ok(getEnvironmentalFeelsLike(0, 50, 8) < 0)
  assert.ok(getEnvironmentalFeelsLike(32, 80, 0) > 32)
  assert.equal(getEnvironmentalFeelsLike(20, 50, 0), 20)
})
