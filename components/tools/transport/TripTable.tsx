'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Star } from 'lucide-react'
import { Trip, Group } from './types'

function fmt(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
function fmtDate(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${m}/${day}/${y}`
}
function fmtMiles(m: number) {
  return m ? m.toLocaleString(undefined, { maximumFractionDigits: 1 }) + ' mi' : '—'
}
function fmtTime(mins: number) {
  if (!mins) return '—'
  return `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`
}
function profitColor(t: Trip) {
  if (t.status === 'cancelled') return 'text-muted'
  if (t.trip_profit >= 5000) return 'text-green-400'
  if (t.trip_profit >= 2000) return 'text-yellow-400'
  return 'text-red-400'
}

type SortCol = 'confirmation_number' | 'status' | 'start_date' | 'grand_total' | 'miles' | 'trip_profit'

interface Props {
  trips: Trip[]
  groups: Group[]
  selected: Set<number>
  onToggleSelect: (id: number) => void
  onSelectAll: (ids: number[]) => void
  onEdit: (trip: Trip) => void
  sortCol: SortCol
  sortAsc: boolean
  onSort: (col: SortCol) => void
}

function GroupRow({ group, trips, selected, onToggle, onEdit }: {
  group: Group
  trips: Trip[]
  selected: Set<number>
  onToggle: (id: number) => void
  onEdit: (t: Trip) => void
}) {
  const [open, setOpen] = useState(true)
  const profit = trips.reduce((s, t) => s + t.trip_profit, 0)
  const miles  = trips.reduce((s, t) => s + t.miles, 0)
  const Icon   = open ? ChevronDown : ChevronRight

  return (
    <>
      <tr
        className="bg-gray-light cursor-pointer hover:bg-border"
        onClick={() => setOpen(o => !o)}
      >
        <td className="px-2 py-2 w-8" />
        <td className="px-3 py-2 text-accent font-semibold text-sm" colSpan={3}>
          <span className="flex items-center gap-1">
            <Icon className="h-3 w-3" />
            ◆ {group.name}
          </span>
        </td>
        <td className="px-2 py-2 text-center text-xs text-muted">
          {trips.length} trip{trips.length !== 1 ? 's' : ''}
        </td>
        <td className="px-2 py-2 text-right text-sm text-foreground">
          {fmt(trips.reduce((s, t) => s + t.grand_total, 0))}
        </td>
        <td className="px-2 py-2 text-right text-xs text-muted">
          {trips.reduce((s, t) => s + t.days, 0)}d
        </td>
        <td className="px-2 py-2 text-right text-xs text-muted">{fmtMiles(miles)}</td>
        <td colSpan={5} />
        <td className={`px-2 py-2 text-right text-sm font-semibold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {fmt(profit)}
        </td>
      </tr>
      {open && trips.map(t => (
        <TripRow key={t.id} trip={t} selected={selected} onToggle={onToggle} onEdit={onEdit} indent />
      ))}
    </>
  )
}

function TripRow({ trip: t, selected, onToggle, onEdit, indent = false }: {
  trip: Trip
  selected: Set<number>
  onToggle: (id: number) => void
  onEdit: (t: Trip) => void
  indent?: boolean
}) {
  const checked = selected.has(t.id)
  const leg     = t.leg_order ? `Leg ${t.leg_order}  ` : ''
  return (
    <tr
      className={`border-b border-border hover:bg-gray-light cursor-pointer ${checked ? 'bg-accent/10' : ''}`}
      onDoubleClick={() => onEdit(t)}
    >
      <td className="px-2 py-2 w-8">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onToggle(t.id)}
          onClick={e => e.stopPropagation()}
          className="accent-accent"
        />
      </td>
      <td className={`px-3 py-2 text-sm font-mono ${profitColor(t)}`}>
        {indent ? <span className="text-muted mr-1 text-xs">{leg}</span> : null}
        #{t.confirmation_number}
      </td>
      <td className="px-2 py-2 text-xs text-muted">{t.bus_number || '—'}</td>
      <td className="px-2 py-2 text-xs text-center">
        <span className={`${t.status === 'cancelled' ? 'text-muted' : 'text-foreground'}`}>
          {t.status === 'cancelled' ? 'Cancelled' : 'Active'}
          {t.is_multiday ? <Star className="inline h-3 w-3 text-yellow-400 ml-1" /> : null}
        </span>
      </td>
      <td className="px-2 py-2 text-xs text-center">{fmtDate(t.start_date)}</td>
      <td className="px-2 py-2 text-right text-sm">{fmt(t.grand_total)}</td>
      <td className="px-2 py-2 text-right text-xs">{t.days}</td>
      <td className="px-2 py-2 text-right text-xs">{fmtMiles(t.miles)}</td>
      <td className="px-2 py-2 text-right text-xs">{fmtTime(t.drive_minutes)}</td>
      <td className="px-2 py-2 text-right text-xs text-muted">{fmt(t.maint_cost)}</td>
      <td className="px-2 py-2 text-right text-xs text-muted">{fmt(t.labor_cost)}</td>
      <td className="px-2 py-2 text-right text-xs text-muted">{fmt(t.fuel_cost)}</td>
      <td className={`px-2 py-2 text-right text-sm font-semibold ${profitColor(t)}`}>
        {fmt(t.trip_profit)}
      </td>
    </tr>
  )
}

const COLS: { key: SortCol; label: string }[] = [
  { key: 'confirmation_number', label: 'Conf #' },
  { key: 'status',              label: 'Status' },
  { key: 'start_date',          label: 'Date' },
  { key: 'grand_total',         label: 'Total' },
  { key: 'miles',               label: 'Miles' },
  { key: 'trip_profit',         label: 'Profit' },
]

export default function TripTable({ trips, groups, selected, onToggleSelect, onSelectAll, onEdit, sortCol, sortAsc, onSort }: Props) {
  const allIds     = trips.map(t => t.id)
  const allChecked = allIds.length > 0 && allIds.every(id => selected.has(id))

  // Split trips into grouped and ungrouped
  const groupedIds = new Set(groups.flatMap(g => g.trips.map(t => t.id)))
  const ungrouped  = trips.filter(t => !groupedIds.has(t.id))
  const visibleGroups = groups.map(g => ({
    ...g,
    trips: g.trips.filter(t => trips.find(tt => tt.id === t.id)),
  })).filter(g => g.trips.length > 0)

  function thClass(col: SortCol) {
    return `px-2 py-2 text-left text-xs font-semibold text-muted cursor-pointer hover:text-accent select-none ${sortCol === col ? 'text-accent' : ''}`
  }

  return (
    <div className="overflow-auto flex-1">
      <table className="w-full text-sm border-collapse min-w-[900px]">
        <thead className="bg-gray-light sticky top-0 z-10">
          <tr>
            <th className="px-2 py-2 w-8">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={() => allChecked ? onSelectAll([]) : onSelectAll(allIds)}
                className="accent-accent"
              />
            </th>
            <th className={thClass('confirmation_number')} onClick={() => onSort('confirmation_number')}>
              Conf # {sortCol === 'confirmation_number' ? (sortAsc ? '▲' : '▼') : ''}
            </th>
            <th className="px-2 py-2 text-xs font-semibold text-muted">Bus #</th>
            <th className={thClass('status')} onClick={() => onSort('status')}>
              Status {sortCol === 'status' ? (sortAsc ? '▲' : '▼') : ''}
            </th>
            <th className={thClass('start_date')} onClick={() => onSort('start_date')}>
              Date {sortCol === 'start_date' ? (sortAsc ? '▲' : '▼') : ''}
            </th>
            <th className={thClass('grand_total')} onClick={() => onSort('grand_total')}>
              Total {sortCol === 'grand_total' ? (sortAsc ? '▲' : '▼') : ''}
            </th>
            <th className="px-2 py-2 text-xs font-semibold text-muted">Days</th>
            <th className={thClass('miles')} onClick={() => onSort('miles')}>
              Miles {sortCol === 'miles' ? (sortAsc ? '▲' : '▼') : ''}
            </th>
            <th className="px-2 py-2 text-xs font-semibold text-muted">Drive</th>
            <th className="px-2 py-2 text-xs font-semibold text-muted">Maint.</th>
            <th className="px-2 py-2 text-xs font-semibold text-muted">Labor</th>
            <th className="px-2 py-2 text-xs font-semibold text-muted">Fuel</th>
            <th className={thClass('trip_profit')} onClick={() => onSort('trip_profit')}>
              Profit {sortCol === 'trip_profit' ? (sortAsc ? '▲' : '▼') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {visibleGroups.map(g => (
            <GroupRow
              key={g.id}
              group={g}
              trips={g.trips}
              selected={selected}
              onToggle={onToggleSelect}
              onEdit={onEdit}
            />
          ))}
          {ungrouped.map(t => (
            <TripRow
              key={t.id}
              trip={t}
              selected={selected}
              onToggle={onToggleSelect}
              onEdit={onEdit}
            />
          ))}
          {trips.length === 0 && (
            <tr>
              <td colSpan={13} className="text-center py-12 text-muted">
                No trips found. Import a report or add a trip to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}