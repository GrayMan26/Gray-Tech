'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Plus, Pencil, Trash2, Upload, Route, Download, Users, RefreshCw, Loader2, X, CheckCircle, AlertCircle, MinusCircle } from 'lucide-react'
import { Trip, Group, StatusFilter, BulkRouteEvent } from '../../../components/tools/transport/types'
import TripTable from '../../../components/tools/transport/TripTable'
import CarSidebar from '../../../components/tools/transport/CarSidebar'
import SummaryBar from '../../../components/tools/transport/SummaryBar'
import TripDialog from '../../../components/tools/transport/TripDialog'
import { TRANSPORT_API } from '../../../lib/api'

type SortCol = 'confirmation_number' | 'status' | 'start_date' | 'grand_total' | 'miles' | 'trip_profit'

function fmt(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
function fmtDate(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${m}/${day}/${y}`
}

// ── Groups Dialog ─────────────────────────────────────────────────────────────

function GroupsDialog({ trips, onClose, onSaved }: { trips: Trip[]; onClose: () => void; onSaved: () => void }) {
  const [groups, setGroups]         = useState<Group[]>([])
  const [selGroupId, setSelGroupId] = useState<number | null>(null)
  const [groupName, setGroupName]   = useState('')
  const [checked, setChecked]       = useState<Set<number>>(new Set())
  const [routeMsg, setRouteMsg]     = useState('')
  const [calcingRoute, setCalcingRoute] = useState(false)
  const [useHome, setUseHome]       = useState(true)

  const loadGroups = useCallback(async () => {
    const r = await fetch(`${TRANSPORT_API}/groups`)
    setGroups(await r.json())
  }, [])

  useEffect(() => { loadGroups() }, [loadGroups])

  function loadGroup(gid: number) {
    setSelGroupId(gid)
    const g = groups.find(x => x.id === gid)
    if (!g) return
    setGroupName(g.name)
    setChecked(new Set(g.trips.map((t: Trip) => t.id)))
    setRouteMsg('')
  }

  async function newGroup() {
    const r = await fetch(`${TRANSPORT_API}/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: `Group ${groups.length + 1}` }),
    })
    const { id } = await r.json()
    await loadGroups()
    setSelGroupId(id)
    setGroupName(`Group ${groups.length + 1}`)
    setChecked(new Set())
    setRouteMsg('')
  }

  async function deleteGroup() {
    if (!selGroupId) return
    if (!confirm('Delete this group? Trips will be unlinked but not deleted.')) return
    await fetch(`${TRANSPORT_API}/groups/${selGroupId}`, { method: 'DELETE' })
    setSelGroupId(null); setGroupName(''); setChecked(new Set())
    await loadGroups(); onSaved()
  }

  async function saveGroup() {
    if (!selGroupId) return
    await fetch(`${TRANSPORT_API}/groups/${selGroupId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: groupName }),
    })
    const selected = trips
      .filter(t => checked.has(t.id))
      .sort((a, b) => a.start_date.localeCompare(b.start_date))
    await fetch(`${TRANSPORT_API}/groups/${selGroupId}/assignments`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trip_ids: selected.map(t => t.id) }),
    })
    await loadGroups(); onSaved()
    alert(`Saved group "${groupName}" with ${checked.size} trip(s).`)
  }

  async function calcGroupRoute() {
    if (!selGroupId) return
    setCalcingRoute(true); setRouteMsg('Calculating…')
    try {
      const r = await fetch(`${TRANSPORT_API}/groups/${selGroupId}/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ use_home_base: useHome }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.detail)
      const h = Math.floor(d.drive_minutes / 60), m = d.drive_minutes % 60
      setRouteMsg(`Combined: ${d.miles} mi  •  ${h}:${String(m).padStart(2,'0')}${d.failed?.length ? `  ⚠ ${d.failed.length} addr skipped` : ''}`)
    } catch (e: unknown) {
      setRouteMsg(e instanceof Error ? e.message : 'Error')
    } finally { setCalcingRoute(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-card-bg border border-border rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Manage Trip Groups</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted" /></button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          {/* Left: group list */}
          <div className="w-44 shrink-0 border-r border-border flex flex-col">
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {groups.map(g => (
                <button key={g.id} onClick={() => loadGroup(g.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selGroupId === g.id ? 'bg-accent text-white' : 'text-foreground hover:bg-gray-light'}`}>
                  {g.name}
                </button>
              ))}
            </div>
            <div className="p-2 flex gap-1">
              <button onClick={newGroup} className="flex-1 text-xs bg-accent text-white rounded px-2 py-1.5 hover:bg-accent/80">+ New</button>
              <button onClick={deleteGroup} className="flex-1 text-xs bg-red-600 text-white rounded px-2 py-1.5 hover:bg-red-500">Delete</button>
            </div>
          </div>
          {/* Right: editor */}
          <div className="flex-1 flex flex-col overflow-hidden p-4 space-y-3">
            <div className="flex gap-2 items-center">
              <label className="text-sm text-muted w-24 shrink-0">Group Name</label>
              <input value={groupName} onChange={e => setGroupName(e.target.value)}
                placeholder="e.g. Newark → Boston Charter"
                className="flex-1 bg-gray-light border border-border rounded px-3 py-1.5 text-sm focus:outline-none focus:border-accent" />
            </div>
            <p className="text-xs text-muted">Select trips to include (ordered by start date):</p>
            <div className="flex-1 overflow-y-auto border border-border rounded divide-y divide-border">
              {trips.sort((a,b) => a.start_date.localeCompare(b.start_date)).map(t => (
                <label key={t.id} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-light">
                  <input type="checkbox" checked={checked.has(t.id)} onChange={() => setChecked(s => { const n = new Set(s); n.has(t.id) ? n.delete(t.id) : n.add(t.id); return n })} className="accent-accent" />
                  <span className={`text-sm ${t.status === 'cancelled' ? 'text-muted' : 'text-foreground'}`}>
                    #{t.confirmation_number}  {fmtDate(t.start_date)}  {t.status === 'cancelled' ? 'Cancelled' : 'Active'}
                  </span>
                </label>
              ))}
            </div>
            {/* Group route */}
            <div className="bg-gray-light rounded p-3 space-y-2">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 text-xs cursor-pointer">
                  <input type="checkbox" checked={useHome} onChange={e => setUseHome(e.target.checked)} className="accent-accent" />
                  Use home base start/end
                </label>
                <button onClick={calcGroupRoute} disabled={calcingRoute || !selGroupId}
                  className="flex items-center gap-1 text-xs bg-accent text-white px-3 py-1.5 rounded hover:bg-accent/80 disabled:opacity-50">
                  {calcingRoute ? <Loader2 className="h-3 w-3 animate-spin" /> : <Route className="h-3 w-3" />}
                  Calculate Group Route
                </button>
              </div>
              {routeMsg && <p className="text-xs text-green-400">{routeMsg}</p>}
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted border border-border rounded hover:bg-gray-light">Close</button>
          <button onClick={saveGroup} disabled={!selGroupId}
            className="px-4 py-2 text-sm bg-accent text-white rounded hover:bg-accent/80 disabled:opacity-50">
            Save Group
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Import Dialog ─────────────────────────────────────────────────────────────

function ImportDialog({ onClose, onImported }: { onClose: () => void; onImported: () => void }) {
  const [preview, setPreview]   = useState<(Record<string, unknown> & { already_exists?: boolean })[] | null>(null)
  const [loading, setLoading]   = useState(false)
  const [importing, setImporting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    setLoading(true)
    const fd = new FormData(); fd.append('file', f)
    try {
      const r = await fetch(`${TRANSPORT_API}/import/parse`, { method: 'POST', body: fd })
      if (!r.ok) throw new Error('Parse failed')
      setPreview(await r.json())
    } catch { alert('Could not parse file. Make sure it is an HTML reservations report.') }
    finally { setLoading(false) }
  }

  async function doImport() {
    if (!preview) return
    setImporting(true)
    try {
      const toImport = preview.filter(t => !t.already_exists)
      const r = await fetch(`${TRANSPORT_API}/import/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trips: toImport }),
      })
      const { imported, skipped } = await r.json()
      alert(`Imported ${imported} trip(s). Skipped ${skipped} (duplicates or errors).`)
      onImported(); onClose()
    } finally { setImporting(false) }
  }

  const active    = preview?.filter(t => t.status === 'active').length ?? 0
  const cancelled = preview?.filter(t => t.status === 'cancelled').length ?? 0
  const dupes     = preview?.filter(t => t.already_exists).length ?? 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-card-bg border border-border rounded-xl shadow-2xl w-full max-w-xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Import Reservations Report</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-muted" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-accent transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-8 w-8 text-muted mx-auto mb-2" />
            <p className="text-sm text-muted">{loading ? 'Parsing…' : 'Click to select an HTML report file'}</p>
            <input ref={fileRef} type="file" accept=".html,.htm" className="hidden" onChange={onFile} />
          </div>

          {preview && (
            <>
              <p className="text-sm text-muted">
                Found {preview.length} trips  •  {active} active  •  {cancelled} cancelled  •  {dupes} already in database (will be skipped)
              </p>
              <div className="border border-border rounded divide-y divide-border overflow-y-auto max-h-48">
                {preview.map((t, i) => (
                  <div key={i} className={`flex items-center justify-between px-3 py-2 text-sm ${t.status === 'cancelled' || t.already_exists ? 'text-muted' : 'text-foreground'}`}>
                    <span>#{String(t.confirmation_number)}  {fmtDate(String(t.start_date))}</span>
                    <span className="flex items-center gap-1">
                      {t.already_exists ? <MinusCircle className="h-3 w-3 text-muted" /> : t.status === 'cancelled' ? <AlertCircle className="h-3 w-3 text-yellow-400" /> : <CheckCircle className="h-3 w-3 text-green-400" />}
                      {t.already_exists ? 'exists' : String(t.status)}  {fmt(Number(t.grand_total))}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end gap-3 px-5 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted border border-border rounded hover:bg-gray-light">Cancel</button>
          <button onClick={doImport} disabled={!preview || importing || dupes === preview?.length}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-accent text-white rounded hover:bg-accent/80 disabled:opacity-50">
            {importing && <Loader2 className="h-4 w-4 animate-spin" />}
            Import All
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Bulk Route Dialog ─────────────────────────────────────────────────────────

function BulkRouteDialog({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [log, setLog]       = useState<{ msg: string; color: string }[]>([])
  const [done, setDone]     = useState(false)
  const [summary, setSummary] = useState('')

  useEffect(() => {
    const es = new EventSource(`${TRANSPORT_API}/trips/route/bulk`)
    es.onmessage = (e) => {
      const d: BulkRouteEvent = JSON.parse(e.data)
      if (d.status === 'done') {
        es.close(); setDone(true); onDone()
        setSummary('All routes calculated.')
        return
      }
      let msg = `#${d.conf}`
      let color = 'text-foreground'
      if (d.status === 'ok') {
        const h = Math.floor((d.drive_minutes ?? 0) / 60)
        const m = (d.drive_minutes ?? 0) % 60
        msg += `  ✓  ${d.miles} mi  •  ${h}:${String(m).padStart(2, '0')}`
        color = d.failed?.length ? 'text-yellow-400' : 'text-green-400'
        if (d.failed?.length) msg += `  ⚠ ${d.failed.length} addr skipped`
      } else if (d.status === 'skipped') {
        msg += '  —  no stops defined'
        color = 'text-muted'
      } else {
        msg += `  ✗  ${d.message}`
        color = 'text-red-400'
      }
      setLog(l => [...l, { msg, color }])
      if (d.failed?.length) {
        setLog(l => [...l, ...(d.failed ?? []).map(a => ({ msg: `     ↳ not found: ${a}`, color: 'text-red-400' }))])
      }
    }
    es.onerror = () => { es.close(); setDone(true); setSummary('Connection error.') }
    return () => es.close()
  }, [onDone])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="bg-card-bg border border-border rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Calculating Routes…</h2>
          {done && <button onClick={onClose}><X className="h-5 w-5 text-muted" /></button>}
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 font-mono text-xs space-y-0.5">
          {!log.length && !done && (
            <div className="flex items-center gap-2 text-muted"><Loader2 className="h-4 w-4 animate-spin" /> Connecting…</div>
          )}
          {log.map((l, i) => <p key={i} className={l.color}>{l.msg}</p>)}
          {summary && <p className="text-green-400 mt-2 font-semibold">{summary}</p>}
        </div>
        <div className="px-5 py-4 border-t border-border flex justify-end">
          <button onClick={onClose} disabled={!done}
            className="px-4 py-2 text-sm bg-accent text-white rounded hover:bg-accent/80 disabled:opacity-50">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function TransportAnalyzerPage() {
  const [trips,       setTrips]       = useState<Trip[]>([])
  const [groups,      setGroups]      = useState<Group[]>([])
  const [buses,       setBuses]       = useState<string[]>([])
  const [loading,     setLoading]     = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [carFilter,   setCarFilter]   = useState('all')
  const [sortCol,     setSortCol]     = useState<SortCol>('confirmation_number')
  const [sortAsc,     setSortAsc]     = useState(true)
  const [selected,    setSelected]    = useState<Set<number>>(new Set())

  const [showAdd,     setShowAdd]     = useState(false)
  const [editTrip,    setEditTrip]    = useState<Trip | null>(null)
  const [showImport,  setShowImport]  = useState(false)
  const [showBulk,    setShowBulk]    = useState(false)
  const [showGroups,  setShowGroups]  = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [tr, gr, bu] = await Promise.all([
        fetch(`${TRANSPORT_API}/trips`).then(r => r.json()),
        fetch(`${TRANSPORT_API}/groups`).then(r => r.json()),
        fetch(`${TRANSPORT_API}/buses`).then(r => r.json()),
      ])
      setTrips(tr); setGroups(gr); setBuses(bu)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  function handleSort(col: SortCol) {
    if (sortCol === col) setSortAsc(a => !a)
    else { setSortCol(col); setSortAsc(true) }
  }

  const filtered = trips
    .filter(t => statusFilter === 'all' || (statusFilter === 'active' ? t.status !== 'cancelled' : t.status === 'cancelled'))
    .filter(t => carFilter === 'all' || (t.bus_number || '') === (carFilter === 'all' ? carFilter : carFilter))
    .sort((a, b) => {
      const av = a[sortCol], bv = b[sortCol]
      return (av < bv ? -1 : av > bv ? 1 : 0) * (sortAsc ? 1 : -1)
    })

  async function handleDelete() {
    const ids = [...selected]
    if (!ids.length) return
    if (!confirm(`Delete ${ids.length} trip(s)? This cannot be undone.`)) return
    await fetch(`${TRANSPORT_API}/trips`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })
    setSelected(new Set()); load()
  }

  async function handleExport() {
    window.location.href = `${TRANSPORT_API}/trips/export.csv`
  }

  const btnClass = (active = false) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${active ? 'bg-accent text-white hover:bg-accent/80' : 'bg-gray-light border border-border text-foreground hover:bg-border'}`

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card-bg flex-wrap">
        <span className="text-sm font-bold text-foreground mr-2">Transport Analyzer</span>
        <button onClick={() => setShowAdd(true)}    className={btnClass()}><Plus className="h-4 w-4" />Add Trip</button>
        <button onClick={() => setShowImport(true)} className={btnClass()}><Upload className="h-4 w-4" />Import</button>
        <button onClick={() => setShowBulk(true)}   className={btnClass(true)}><Route className="h-4 w-4" />Calc Routes</button>
        <button onClick={() => setShowGroups(true)} className={btnClass()}><Users className="h-4 w-4" />Groups</button>
        <button onClick={handleExport}              className={btnClass()}><Download className="h-4 w-4" />Export CSV</button>
        {selected.size === 1 && (
          <button onClick={() => { const t = trips.find(t => selected.has(t.id)); if (t) setEditTrip(t) }} className={btnClass()}>
            <Pencil className="h-4 w-4" />Edit
          </button>
        )}
        {selected.size > 0 && (
          <button onClick={handleDelete} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition-colors">
            <Trash2 className="h-4 w-4" />Delete ({selected.size})
          </button>
        )}
        <button onClick={load} className="ml-auto text-muted hover:text-foreground"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></button>

        {/* Status filter */}
        <div className="flex rounded overflow-hidden border border-border">
          {(['all', 'active', 'cancelled'] as StatusFilter[]).map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-3 py-1 text-xs capitalize transition-colors ${statusFilter === f ? 'bg-accent text-white' : 'text-muted hover:bg-gray-light'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <CarSidebar buses={buses} selected={carFilter} onSelect={setCarFilter} />
        <div className="flex flex-col flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center flex-1 text-muted">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading trips…
            </div>
          ) : (
            <TripTable
              trips={filtered}
              groups={groups}
              selected={selected}
              onToggleSelect={id => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })}
              onSelectAll={ids => setSelected(new Set(ids))}
              onEdit={t => setEditTrip(t)}
              sortCol={sortCol}
              sortAsc={sortAsc}
              onSort={handleSort}
            />
          )}
          <SummaryBar trips={trips} />
        </div>
      </div>

      {/* Modals */}
      {showAdd    && <TripDialog onSave={() => { setShowAdd(false); load() }}    onClose={() => setShowAdd(false)} />}
      {editTrip   && <TripDialog trip={editTrip} onSave={() => { setEditTrip(null); load() }} onClose={() => setEditTrip(null)} />}
      {showImport && <ImportDialog onClose={() => setShowImport(false)} onImported={load} />}
      {showBulk   && <BulkRouteDialog onClose={() => setShowBulk(false)} onDone={load} />}
      {showGroups && <GroupsDialog trips={trips} onClose={() => setShowGroups(false)} onSaved={load} />}
    </div>
  )
}