'use client'

import { Trip } from './types'

function fmt(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

interface Props { trips: Trip[] }

export default function SummaryBar({ trips }: Props) {
  const active    = trips.filter(t => t.status !== 'cancelled')
  const cancelled = trips.filter(t => t.status === 'cancelled')

  const totalProfit = active.reduce((s, t) => s + t.trip_profit, 0)
  const avgTrip     = active.length ? totalProfit / active.length : 0
  const avgDay      = active.length ? active.reduce((s, t) => s + t.profit_per_day, 0) / active.length : 0
  const totalMiles  = active.reduce((s, t) => s + t.miles, 0)
  const totalFuel   = active.reduce((s, t) => s + t.fuel_cost, 0)
  const best        = active.length ? active.reduce((a, b) => b.trip_profit > a.trip_profit ? b : a) : null

  const stats = [
    { label: 'Active Trips',    value: active.length.toString() },
    { label: 'Cancelled',       value: cancelled.length.toString(), red: cancelled.length > 0 },
    { label: 'Total Profit',    value: fmt(totalProfit), green: totalProfit >= 0 },
    { label: 'Avg / Trip',      value: fmt(avgTrip) },
    { label: 'Avg / Day',       value: fmt(avgDay) },
    { label: 'Total Miles',     value: totalMiles ? `${totalMiles.toLocaleString(undefined, { maximumFractionDigits: 1 })} mi` : '—' },
    { label: 'Total Fuel',      value: fmt(totalFuel) },
    { label: 'Most Profitable', value: best ? `#${best.confirmation_number}  ${fmt(best.trip_profit)}` : '—', green: !!best },
  ]

  return (
    <div className="bg-gray-light border-t border-border px-4 py-3 flex flex-wrap gap-x-8 gap-y-2">
      {stats.map(s => (
        <div key={s.label} className="flex flex-col items-start min-w-[100px]">
          <span className="text-xs text-muted">{s.label}</span>
          <span className={`text-sm font-semibold ${s.green ? 'text-green-400' : s.red ? 'text-red-400' : 'text-foreground'}`}>
            {s.value}
          </span>
        </div>
      ))}
    </div>
  )
}