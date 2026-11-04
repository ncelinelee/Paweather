// Linear estimates are only available inside the observed forecast horizon.
export const interpolateForecast = (points, targetTimestamp) => {
  if (!points.length || !Number.isFinite(targetTimestamp)) return null
  points = [...points].filter((item) => Number.isFinite(item.timestamp)).sort((a, b) => a.timestamp - b.timestamp)
  if (!points.length || targetTimestamp < points[0].timestamp || targetTimestamp > points[points.length - 1].timestamp) return null
  const lower = [...points].reverse().find((item) => item.timestamp <= targetTimestamp) || points[0]
  const upper = points.find((item) => item.timestamp >= targetTimestamp) || points[points.length - 1]
  if (!lower || !upper) return null
  if (lower.timestamp === upper.timestamp) return { ...lower, timestamp: targetTimestamp }

  const ratio = Math.min(1, Math.max(0, (targetTimestamp - lower.timestamp) / (upper.timestamp - lower.timestamp)))
  const interpolate = (from, to, digits = 0) => {
    const value = Number(from) + (Number(to) - Number(from)) * ratio
    const factor = 10 ** digits
    return Math.round(value * factor) / factor
  }
  return {
    timestamp: targetTimestamp,
    temp: interpolate(lower.temp, upper.temp, 1),
    feelsLike: interpolate(lower.feelsLike, upper.feelsLike, 1),
    humidity: interpolate(lower.humidity, upper.humidity),
    rain: interpolate(lower.rain, upper.rain),
    wind: interpolate(lower.wind, upper.wind, 1),
    status: ratio < 0.5 ? lower.status : upper.status
  }
}
