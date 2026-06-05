'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react'
import { Trip, Stop } from './types'
import { TRANSPORT_API } from '../../../lib/api'

const HOME_BASE = '100 Continental Dr, Newark, Delaware 19713, US'

interface Props {
  trip?: Trip | null
  onSave: () => void
  onClose: () => void
}

function fmtHHMM(mins: number) {
  return `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`
}
function parseHHMM(s: string): number {
  const [h, m] = s.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

export default function TripDialog({ trip, onSave, onClose }: Props) {
  const isEdit = !!trip

  // Details fields
  const [conf,      setConf]      = useState(trip?.confirmation_number ?? '')
  const [bus,       setBus]       = useState(trip?.bus_number ?? '')
  const [startDate, setStartDate] = useState(trip?.start_date ?? '')
  const [endDate,   setEndDate]   = useState(trip?.end_date ?? '')
  const [total,     setTotal]     = useState(trip ? String(trip.grand_total) : '')
  const [days,      setDays]      = useState(trip ? String(trip.days) : '1')
  const [miles,     setMiles]     = useState(trip ? String(trip.miles) : '')
  const [driveTime, setDriveTime] = useState(trip?.drive_minutes ? fmtHHMM(trip.drive_minutes) : '')
  const [status,    setStatus]    = useState(trip?.status ?? 'active')
  const [multiday,  setMultiday]  = useState(!!trip?.is_multiday)
  const [tab,       setTab]       = useState<'details' | 'route'>('details')

  // Route fields
  const [useHomeBase, setUseHomeBase] = useState(true)
  const [stops,       setStops]       = useState<Stop[]>([{ stop_type: 'WT', address: '' }])
  const [routeMsg,    setRouteMsg]    = useState('')
  const [routeErr,    setRouteErr]    = useState(false)
  const [failedAddrs, setFailedAddrs] = useState<string[]>([])
  const [calculating, setCalculating] = useState(false)

  // Load existing stops when editing
  useEffect(() => {
    if (!trip) return
    fetch(`${TRANSPORT_API}/trips/${trip.id}/stops`)
      .then(r => r.json())
      .then((raw: Stop[]) => {
        const middle = raw.filter(s => s.address.trim().toLowerCase() !== HOME_BASE.toLowerCase())
        setStops(middle.length ? middle : [{ stop_type: 'WT', address: '' }])
        const hasHome = raw.some(s => s.address.trim().toLowerCase() === HOME_BASE.toLowerCase())
        setUseHomeBase(raw.length === 0 || hasHome)
      })
      .catch(() => {})
  }, [trip])

  function addStop() {
    setStops(s => [...s, { stop_type: 'WT', address: '' }])
  }
  function removeStop(i: number) {
    setStops(s => s.filter((_, idx) => idx !== i))
  }
  function updateStop(i: number, field: keyof Stop, value: string) {
    setStops(s => s.map((st, idx) => idx === i ? { ...st, [field]: value } : st))
  }

  async function calcRoute() {
    const middle = stops.map(s => s.address).filter(Boolean)
    if (!middle.length) { setRouteMsg('Add at least one stop address.'); setRouteErr(true); return }
    const addresses = useHomeBase ? [HOME_BASE, ...middle, HOME_BASE] : middle
    setCalculating(true); setRouteMsg('Calculating…'); setRouteErr(false); setFailedAddrs([])
    try {
      const r = await fetch(`${TRANSPORT_API}/calculate-route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.detail || 'Route error')
      setMiles(String(data.total_miles))
      setDriveTime(fmtHHMM(data.total_minutes))
      setRouteMsg(`${data.total_miles} mi  •  ${fmtHHMM(data.total_minutes)}`)
      setRouteErr(false)
      setFailedAddrs(data.failed ?? [])
    } catch (e: unknown) {
      setRouteMsg(e instanceof Error ? e.message : 'Error')
      setRouteErr(true)
    } finally {
      setCalculating(false)
    }
  }

  async function handleSave() {
    if (!conf.trim()) { alert('Confirmation # is required.'); return }
    const body = {
      confirmation_number: conf.trim(),
      bus_number:  bus.trim(),
      start_date:  startDate,
      end_date:    endDate || startDate,
      grand_total: parseFloat(total) || 0,
      days:        parseInt(days) || 1,
      miles:       parseFloat(miles) || 0,
      drive_minutes: parseHHMM(driveTime),
      status,
      is_multiday: multiday ? 1 : 0,
    }
    try {
      const url    = isEdit ? `${TRANSPORT_API}/trips/${trip!.id}` : `${TRANSPORT_API}/trips`
      const method = isEdit ? 'PUT' : 'POST'
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!r.ok) {
        const err = await r.json()
        throw new Error(err.detail || 'Save failed')
      }

      // Save stops
      const tripId = isEdit ? trip!.id : (await r.json()).id
      const saveStops: Stop[] = useHomeBase
        ? [{ stop_type: 'PU', address: HOME_BASE }, ...stops.filter(s => s.address.trim()), { stop_type: 'DO', address: HOME_BASE }]
        : stops.filter(s => s.address.trim())
      await fetch(`${TRANSPORT_API}/trips/${tripId}/stops`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveStops),
      })
      onSave()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Save failed')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-card-bg border border-border rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {isEdit ? `Edit Trip #${trip!.confirmation_number}` : 'Add Trip'}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {(['details', 'route'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-medium capitalize transition-colors ${
                tab === t ? 'text-accent border-b-2 border-accent' : 'text-muted hover:text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {tab === 'details' && (
            <div className="space-y-3">
              {[
                { label: 'Confirmation #', value: conf, set: setConf, required: true },
                { label: 'Bus #',          value: bus,  set: setBus  },
                { label: 'Grand Total ($)', value: total, set: setTotal },
                { label: 'Days of Trip',   value: days,  set: setDays },
                { label: 'Miles',          value: miles, set: setMiles },
                { label: 'Drive Time (H:MM)', value: driveTime, set: setDriveTime },
              ].map(({ label, value, set, required }) => (
                <div key={label} className="flex items-center gap-3">
                  <label className="w-40 text-sm text-muted text-right shrink-0">{label}{required ? ' *' : ''}</label>
                  <input
                    value={value}
                    onChange={e => set(e.target.value)}
                    className="flex-1 bg-gray-light border border-border rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              ))}

              <div className="flex items-center gap-3">
                <label className="w-40 text-sm text-muted text-right shrink-0">Start Date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                  className="flex-1 bg-gray-light border border-border rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-accent" />
              </div>
              <div className="flex items-center gap-3">
                <label className="w-40 text-sm text-muted text-right shrink-0">End Date</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                  className="flex-1 bg-gray-light border border-border rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-accent" />
              </div>

              <div className="flex items-center gap-3">
                <label className="w-40 text-sm text-muted text-right shrink-0">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)}
                  className="flex-1 bg-gray-light border border-border rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-accent">
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <label className="w-40 text-sm text-muted text-right shrink-0">Multi-day</label>
                <input type="checkbox" checked={multiday} onChange={e => setMultiday(e.target.checked)}
                  className="accent-accent h-4 w-4" />
              </div>
            </div>
          )}

          {tab === 'route' && (
            <div className="space-y-3">
              {/* Home base toggle */}
              <div className="flex items-center gap-2">
                <button onClick={() => setUseHomeBase(v => !v)} className="text-accent">
                  {useHomeBase ? <ToggleRight className="h-6 w-6" /> : <ToggleLeft className="h-6 w-6 text-muted" />}
                </button>
                <span className="text-sm text-foreground">Use home base as start & end</span>
              </div>
              {useHomeBase && (
                <p className="text-xs text-muted pl-8">
                  Route: Home Base → your stops → Home Base
                </p>
              )}

              {/* Fixed home base row */}
              {useHomeBase && (
                <div className="bg-accent/10 border border-accent/30 rounded px-3 py-2 text-xs text-accent">
                  PU  —  {HOME_BASE}  (Fixed)
                </div>
              )}

              {/* Stop rows */}
              <div className="space-y-2">
                {stops.map((s, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <select
                      value={s.stop_type}
                      onChange={e => updateStop(i, 'stop_type', e.target.value)}
                      className="w-16 bg-gray-light border border-border rounded px-1 py-1.5 text-xs text-foreground focus:outline-none focus:border-accent"
                    >
                      {['PU', 'WT', 'ST', 'DO'].map(t => <option key={t}>{t}</option>)}
                    </select>
                    <input
                      value={s.address}
                      onChange={e => updateStop(i, 'address', e.target.value)}
                      placeholder="Full address…"
                      className="flex-1 bg-gray-light border border-border rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-accent"
                    />
                    <button onClick={() => removeStop(i)} className="text-red-400 hover:text-red-300 shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {useHomeBase && (
                <div className="bg-accent/10 border border-accent/30 rounded px-3 py-2 text-xs text-accent">
                  DO  —  {HOME_BASE}  (Fixed)
                </div>
              )}

              <button
                onClick={addStop}
                className="flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Stop
              </button>

              <button
                onClick={calcRoute}
                disabled={calculating}
                className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded text-sm font-medium hover:bg-accent/80 disabled:opacity-50 transition-colors"
              >
                {calculating && <Loader2 className="h-4 w-4 animate-spin" />}
                Calculate Route
              </button>

              {routeMsg && (
                <p className={`text-sm font-medium ${routeErr ? 'text-red-400' : failedAddrs.length ? 'text-yellow-400' : 'text-green-400'}`}>
                  {routeMsg}
                </p>
              )}
              {failedAddrs.length > 0 && (
                <div className="text-xs text-red-400 space-y-0.5">
                  <p className="font-medium">Could not geocode:</p>
                  {failedAddrs.map(a => <p key={a} className="pl-3">• {a}</p>)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-border">
          <button onClick={onClose}
            className="px-4 py-2 text-sm text-muted border border-border rounded hover:bg-gray-light transition-colors">
            Cancel
          </button>
          <button onClick={handleSave}
            className="px-4 py-2 text-sm bg-accent text-white rounded hover:bg-accent/80 transition-colors">
            Save Trip
          </button>
        </div>
      </div>
    </div>
  )
}