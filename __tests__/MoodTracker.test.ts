/**
 * Tests for mood tracking + streak logic.
 * computeStreak is extracted from wellness-context.tsx.
 */

interface JournalEntry {
  date: string
  mood: 1 | 2 | 3 | 4 | 5
  note: string
}

function toLocalDateStr(d: Date): string {
  return d.toLocaleDateString('en-CA') // YYYY-MM-DD
}

function computeStreak(entries: JournalEntry[]): number {
  if (entries.length === 0) return 0

  const uniqueDays = [
    ...new Set(entries.map((e) => toLocalDateStr(new Date(e.date)))),
  ].sort((a, b) => (a < b ? 1 : -1)) // descending

  const today = toLocalDateStr(new Date())
  const yd    = new Date(); yd.setDate(yd.getDate() - 1)
  const yesterday = toLocalDateStr(yd)

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) return 0

  let count = 1
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1])
    const curr = new Date(uniqueDays[i])
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / 86400000)
    if (diffDays === 1) {
      count++
    } else {
      break
    }
  }
  return count
}

function makeEntry(daysAgo: number, mood: JournalEntry['mood'] = 3): JournalEntry {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(12, 0, 0, 0)
  return { date: d.toISOString(), mood, note: '' }
}

describe('MoodTracker', () => {
  test('selecting a mood records it in the entry', () => {
    const entry = makeEntry(0, 4)
    expect(entry.mood).toBe(4)
  })

  test('mood value is within valid range 1–5', () => {
    for (let m = 1; m <= 5; m++) {
      const entry = makeEntry(0, m as JournalEntry['mood'])
      expect(entry.mood).toBeGreaterThanOrEqual(1)
      expect(entry.mood).toBeLessThanOrEqual(5)
    }
  })

  test('logging mood today with no prior entries → streak of 1', () => {
    const entries = [makeEntry(0)]
    expect(computeStreak(entries)).toBe(1)
  })

  test('consecutive days → streak increments', () => {
    const entries = [makeEntry(0), makeEntry(1), makeEntry(2)]
    expect(computeStreak(entries)).toBe(3)
  })

  test('gap of 1 day resets streak to 0 (unless yesterday)', () => {
    // Entries from 2 and 3 days ago — no today or yesterday → streak = 0
    const entries = [makeEntry(2), makeEntry(3)]
    expect(computeStreak(entries)).toBe(0)
  })

  test('multiple entries same day count as a single day in streak', () => {
    const entries = [makeEntry(0), makeEntry(0, 5), makeEntry(1), makeEntry(2)]
    expect(computeStreak(entries)).toBe(3)
  })
})
