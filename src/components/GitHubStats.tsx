import { useEffect, useState } from "react"
import { useInView } from "@/hooks/useInView"
import { cn } from "@/lib/utils"

type DayMap = Record<string, number>

const ACCOUNTS = [
  { username: "GavinJaynes", label: "Personal" },
  { username: "garlic-brewlabs", label: "Brewlabs" },
]

function getLast91Days(): string[] {
  const days: string[] = []
  const today = new Date()
  for (let i = 90; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

function buildDayMap(events: Array<{ created_at: string }>): DayMap {
  const map: DayMap = {}
  for (const e of events) {
    const date = e.created_at.slice(0, 10)
    map[date] = (map[date] ?? 0) + 1
  }
  return map
}

function mergeDayMaps(...maps: DayMap[]): DayMap {
  const merged: DayMap = {}
  for (const map of maps) {
    for (const [date, count] of Object.entries(map)) {
      merged[date] = (merged[date] ?? 0) + count
    }
  }
  return merged
}

function intensityClass(count: number) {
  if (count === 0) return "bg-zinc-800"
  if (count <= 2) return "bg-chart-1/30"
  if (count <= 5) return "bg-chart-1/60"
  return "bg-chart-1"
}

async function fetchUserEvents(username: string): Promise<DayMap> {
  const pages = await Promise.all(
    [1, 2, 3].map((page) =>
      fetch(`https://api.github.com/users/${username}/events/public?per_page=100&page=${page}`)
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => [])
    )
  )
  return buildDayMap(pages.flat())
}

function useCombinedContributions(usernames: string[]) {
  const [dayMap, setDayMap] = useState<DayMap | null>(null)

  useEffect(() => {
    Promise.all(usernames.map(fetchUserEvents))
      .then((maps) => mergeDayMaps(...maps))
      .then(setDayMap)
  }, [usernames.join(",")])

  return dayMap
}

export function GitHubStats() {
  const { ref, inView } = useInView()
  const usernames = ACCOUNTS.map((a) => a.username)
  const dayMap = useCombinedContributions(usernames)
  const days = getLast91Days()

  const weeks: string[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  const totalActive = dayMap ? Object.values(dayMap).filter(Boolean).length : 0

  return (
    <div
      ref={ref}
      className={cn(
        "mt-10",
        inView
          ? "animate-in fade-in slide-in-from-bottom-3 duration-700 delay-200 fill-mode-both"
          : "opacity-0"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-600">
          GitHub Activity
        </p>
        <div className="flex items-center gap-4">
          {ACCOUNTS.map(({ username, label }) => (
            <a
              key={username}
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-zinc-600 hover:text-chart-1 transition-colors tracking-wide"
            >
              @{username} ↗ <span className="text-zinc-700">({label})</span>
            </a>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-5">
        {dayMap && (
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs text-zinc-500">
              Combined activity across both accounts
            </span>
            <span className="font-mono text-xs text-zinc-500">
              {totalActive} active days (90d)
            </span>
          </div>
        )}

        {dayMap ? (
          <div className="flex gap-[3px] overflow-x-auto pb-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day) => {
                  const count = dayMap[day] ?? 0
                  return (
                    <div
                      key={day}
                      title={`${day}: ${count} event${count !== 1 ? "s" : ""}`}
                      className={cn("size-[10px] rounded-[2px] shrink-0", intensityClass(count))}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-[3px]">
            {Array.from({ length: 13 }).map((_, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, di) => (
                  <div key={di} className="size-[10px] rounded-[2px] bg-zinc-800 animate-pulse" />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
