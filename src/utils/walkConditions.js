// Product heuristics, not a veterinary prediction model. Temperatures use Celsius.

export const getSeniorAge = (size) => {
  if (size === '대형견') return 7
  if (size === '중형견') return 9
  return 11
}

export const getAgeInYears = (age, ageUnit = 'years') => ageUnit === 'months' ? Number(age) / 12 : Number(age)

export const getEnvironmentalFeelsLike = (tempC, humidity, wind = 0) => {
  const temperature = Number(tempC)
  const relativeHumidity = Number(humidity)
  const windMps = Number(wind)

  // 추울 때는 풍속을 반영한 wind-chill, 더울 때는 습도를 반영한 heat-index를 사용한다.
  if (temperature <= 10 && windMps >= 1.34) {
    const windKmh = windMps * 3.6
    const windFactor = windKmh ** 0.16
    return 13.12 + 0.6215 * temperature - 11.37 * windFactor + 0.3965 * temperature * windFactor
  }

  if (temperature < 27 || relativeHumidity < 40) return temperature
  const tempF = temperature * 9 / 5 + 32
  const heatIndexF =
    -42.379 + 2.04901523 * tempF + 10.14333127 * relativeHumidity - 0.22475541 * tempF * relativeHumidity -
    0.00683783 * tempF * tempF - 0.05481717 * relativeHumidity * relativeHumidity +
    0.00122874 * tempF * tempF * relativeHumidity + 0.00085282 * tempF * relativeHumidity * relativeHumidity -
    0.00000199 * tempF * tempF * relativeHumidity * relativeHumidity
  return (heatIndexF - 32) * 5 / 9
}

export const getDogThermalVulnerability = (dog, environmentalFeelsLike) => {
  const age = Number(dog?.age)
  const size = dog?.size || '중형견'
  const senior = age >= getSeniorAge(size)
  const reasons = []

  if (age < 1) reasons.push('puppy')
  else if (senior) reasons.push('senior')

  if (environmentalFeelsLike >= 24 && size === '대형견') reasons.push('largeHeat')
  if (environmentalFeelsLike <= 10 && size === '소형견') reasons.push('smallCold')

  // 개별 위험 요인은 온도를 임의로 바꾸지 않고 더위·추위 구간에서 위험도를 한 단계만 높인다.
  const isThermalStressZone = environmentalFeelsLike >= 24 || environmentalFeelsLike <= 10
  return { adjustment: isThermalStressZone && reasons.length ? 1 : 0, reasons }
}

export const getWalkEnvironmentFeelsLike = (tempC, humidity, wind) =>
  Math.round(getEnvironmentalFeelsLike(tempC, humidity, wind))

export const getRecommendedWalkMinutes = (dog, level) => {
  if (level !== '가벼운 산책 가능') return null
  const age = Number(dog.age)
  const seniorAge = getSeniorAge(dog.size)
  if (age < 1 || age >= seniorAge) return 10
  if (dog.size === '소형견') return 10
  if (dog.size === '중형견') return 20
  return 30
}

export const classifyWalkConditions = (weather, dog) => {
  const dogFeelsLike = getWalkEnvironmentFeelsLike(weather.temp, weather.humidity, weather.wind)
  const aqi = Number(weather.aqi || 0)
  let baseLevel = '안전'

  if (
    weather.status === '뇌우' || weather.status === '폭우' ||
    dogFeelsLike >= 34 || dogFeelsLike <= -10 || weather.wind >= 12 || aqi >= 5
  ) {
    baseLevel = '위험'
  } else if (
    dogFeelsLike >= 30 || dogFeelsLike <= 0 ||
    weather.wind >= 8 || aqi >= 4
  ) {
    baseLevel = '주의'
  } else if (
    weather.status === '비' || dogFeelsLike >= 26 || dogFeelsLike <= 7 || weather.humidity >= 80 || aqi >= 3
  ) {
    baseLevel = '가벼운 산책 가능'
  }

  const levels = ['안전', '가벼운 산책 가능', '주의', '위험']
  const vulnerability = getDogThermalVulnerability(dog, dogFeelsLike)
  const baseLevelIndex = levels.indexOf(baseLevel)
  const finalLevelIndex = Math.min(baseLevelIndex + vulnerability.adjustment, levels.length - 1)
  return { level: levels[finalLevelIndex], reasons: finalLevelIndex > baseLevelIndex ? vulnerability.reasons : [] }

}
