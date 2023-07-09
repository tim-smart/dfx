import { Duration, millis, zero } from "@effect/data/Duration"

export const delayFrom = (
  window: number,
  limit: number,
  count: number,
  ttl: number,
): Duration => {
  const perRequest = Math.ceil(window / limit)

  const totalTime = count * perRequest
  const elapsedTime = totalTime - ttl
  const elapsedWindows = Math.floor(elapsedTime / window)
  const completedRequests = elapsedWindows * limit
  const remainingRequests = count - completedRequests
  const remainingWindows = Math.floor((remainingRequests - 1) / limit)
  const delayRemainder = elapsedTime % window

  const requestRemainder = count % limit
  const staggerDelay = requestRemainder * 50

  if (remainingWindows === 0) {
    return zero
  }

  return millis(remainingWindows * window - delayRemainder + staggerDelay)
}
