export const TARGET_STREAK = 10

export function shuffleItems(items) {
  const shuffled = [...items]

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]]
  }

  return shuffled
}

export function evaluateCardSelection(clickedIds, selectedId) {
  if (clickedIds.includes(selectedId)) {
    return {
      status: 'fail',
      streak: clickedIds.length,
      clickedIds,
    }
  }

  const nextClickedIds = [...clickedIds, selectedId]
  const nextStreak = nextClickedIds.length

  return {
    status: nextStreak >= TARGET_STREAK ? 'win' : 'continue',
    streak: nextStreak,
    clickedIds: nextClickedIds,
  }
}

export function mergeGifPools(existingPool, incomingPool) {
  const byId = new Map(existingPool.map((item) => [item.id, item]))

  incomingPool.forEach((item) => {
    if (!byId.has(item.id)) {
      byId.set(item.id, item)
    }
  })

  return [...byId.values()]
}

export function selectBoardFromPool(pool, count) {
  const safeCount = Math.max(0, Math.min(count, pool.length))
  return shuffleItems(pool).slice(0, safeCount)
}
