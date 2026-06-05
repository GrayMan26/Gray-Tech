'use client'

import { useState, useRef } from 'react'
import { Upload, Search, Download, Loader2, Music, X, CheckCircle } from 'lucide-react'
import { METADATA_API } from '../../../lib/api'

interface Meta {
  title: string
  artist: string
  album: string
  year: string
  track: string
  cover_base64: string | null
}

interface DiscogsResult {
  id: number
  title: string
  artist: string
  year: string
  label: string
  thumb: string
  cover_url: string
  format: string
}

interface FileEntry {
  file: File
  name: string
  status: 'pending' | 'loading' | 'found' | 'not_found' | 'error'
  meta: Meta
}

const emptyMeta = (): Meta => ({ title: '', artist: '', album: '', year: '', track: '', cover_base64: null })

export default function MetadataFinderPage() {
  const [files,      setFiles]      = useState<FileEntry[]>([])
  const [activeIdx,  setActiveIdx]  = useState<number | null>(null)
  const [discogs,    setDiscogs]    = useState<DiscogsResult[]>([])
  const [searching,  setSearching]  = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [saveMsg,    setSaveMsg]    = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function active(): FileEntry | null { return activeIdx !== null ? files[activeIdx] : null }

  function updateMeta(idx: number, field: keyof Meta, value: string) {
    setFiles(f => f.map((e, i) => i === idx ? { ...e, meta: { ...e.meta, [field]: value } } : e))
  }

  async function identify(idx: number) {
    setFiles(f => f.map((e, i) => i === idx ? { ...e, status: 'loading' } : e))
    const fd = new FormData()
    fd.append('file', files[idx].file)
    try {
      const r = await fetch(`${METADATA_API}/identify`, { method: 'POST', body: fd })
      const d = await r.json()
      if (d.found) {
        setFiles(f => f.map((e, i) => i === idx ? {
          ...e, status: 'found',
          meta: { title: d.title || '', artist: d.artist || '', album: d.album || '', year: d.year || '', track: d.track || '', cover_base64: d.cover_base64 || null },
        } : e))
      } else {
        setFiles(f => f.map((e, i) => i === idx ? { ...e, status: 'not_found' } : e))
      }
    } catch {
      setFiles(f => f.map((e, i) => i === idx ? { ...e, status: 'error' } : e))
    }
  }

  async function searchDiscogs() {
    const a = active(); if (!a) return
    setSearching(true); setDiscogs([])
    try {
      const params = new URLSearchParams({ query: a.meta.title, artist: a.meta.artist })
      const r = await fetch(`${METADATA_API}/search/discogs?${params}`)
      setDiscogs(await r.json())
    } catch { alert('Discogs search failed.') }
    finally { setSearching(false) }
  }

  function applyDiscogs(result: DiscogsResult) {
    if (activeIdx === null) return
    setFiles(f => f.map((e, i) => i === activeIdx ? {
      ...e,
      meta: { ...e.meta, title: result.title || e.meta.title, artist: result.artist || e.meta.artist, year: result.year || e.meta.year, cover_base64: null },
    } : e))
    setDiscogs([])
    // Fetch cover art
    if (result.cover_url) {
      const params = new URLSearchParams({ title: result.title, artist: result.artist, cover_url: result.cover_url })
      fetch(`${METADATA_API}/cover-art?${params}`)
        .then(r => r.blob())
        .then(blob => new Promise<string>((res, rej) => {
          const reader = new FileReader()
          reader.onloadend = () => res((reader.result as string).split(',')[1])
          reader.onerror = rej
          reader.readAsDataURL(blob)
        }))
        .then(b64 => {
          setFiles(f => f.map((e, i) => i === activeIdx ? { ...e, meta: { ...e.meta, cover_base64: b64 } } : e))
        })
        .catch(() => {})
    }
  }

  async function saveTaggedFile() {
    if (activeIdx === null) return
    const entry = files[activeIdx]
    setSaving(true); setSaveMsg('')
    try {
      const fd = new FormData()
      fd.append('file', entry.file)
      const m = entry.meta
      fd.append('title',        m.title)
      fd.append('artist',       m.artist)
      fd.append('album',        m.album)
      fd.append('year',         m.year)
      fd.append('track',        m.track)
      fd.append('cover_base64', m.cover_base64 ?? '')

      const r = await fetch(`${METADATA_API}/write-tags`, { method: 'POST', body: fd })
      if (!r.ok) throw new Error('Write failed')
      const blob = await r.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `${m.title || 'track'}.mp3`
      a.click()
      URL.revokeObjectURL(url)
      setSaveMsg('Downloaded!')
    } catch (e: unknown) {
      setSaveMsg(e instanceof Error ? e.message : 'Error')
    } finally { setSaving(false) }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const newFiles = [...e.dataTransfer.files].filter(f => f.name.endsWith('.mp3'))
    addFiles(newFiles)
  }

  function addFiles(newFiles: File[]) {
    setFiles(prev => [
      ...prev,
      ...newFiles.map(f => ({ file: f, name: f.name, status: 'pending' as const, meta: emptyMeta() })),
    ])
    if (activeIdx === null && newFiles.length) setActiveIdx(0)
  }

  function statusColor(s: FileEntry['status']) {
    if (s === 'found')     return 'text-green-400'
    if (s === 'not_found') return 'text-yellow-400'
    if (s === 'error')     return 'text-red-400'
    if (s === 'loading')   return 'text-accent'
    return 'text-muted'
  }

  const a = active()

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      {/* Left: file list */}
      <aside className="w-56 shrink-0 border-r border-border flex flex-col bg-card-bg">
        <div className="p-3 border-b border-border">
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 bg-accent text-white text-sm py-2 rounded hover:bg-accent/80 transition-colors"
          >
            <Upload className="h-4 w-4" /> Add MP3 Files
          </button>
          <input ref={fileRef} type="file" accept=".mp3" multiple className="hidden"
            onChange={e => addFiles([...( e.target.files ?? [])])} />
        </div>
        <div
          className="flex-1 overflow-y-auto"
          onDragOver={e => e.preventDefault()}
          onDrop={onDrop}
        >
          {files.length === 0 && (
            <p className="text-xs text-muted text-center p-4">Drop MP3 files here or click Add</p>
          )}
          {files.map((f, i) => (
            <div key={i}
              onClick={() => { setActiveIdx(i); setDiscogs([]) }}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer border-b border-border text-sm ${activeIdx === i ? 'bg-accent/20' : 'hover:bg-gray-light'}`}
            >
              <Music className={`h-4 w-4 shrink-0 ${statusColor(f.status)}`} />
              <span className="truncate text-xs text-foreground flex-1">{f.name}</span>
              {f.status === 'loading' && <Loader2 className="h-3 w-3 animate-spin text-accent shrink-0" />}
              {f.status === 'found'   && <CheckCircle className="h-3 w-3 text-green-400 shrink-0" />}
            </div>
          ))}
        </div>
      </aside>

      {/* Right: editor */}
      <div className="flex-1 flex overflow-hidden">
        {a === null ? (
          <div className="flex-1 flex items-center justify-center text-muted">
            <div className="text-center">
              <Music className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Select or add an MP3 file to get started</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex gap-6 overflow-y-auto p-6">
            {/* Cover art + identify */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div className="w-48 h-48 bg-gray-light border border-border rounded-lg overflow-hidden flex items-center justify-center">
                {a.meta.cover_base64 ? (
                  <img src={`data:image/jpeg;base64,${a.meta.cover_base64}`} className="w-full h-full object-cover" alt="cover" />
                ) : (
                  <Music className="h-12 w-12 text-muted" />
                )}
              </div>
              <button
                onClick={() => identify(activeIdx!)}
                disabled={a.status === 'loading'}
                className="w-48 flex items-center justify-center gap-2 bg-accent text-white text-sm py-2 rounded hover:bg-accent/80 disabled:opacity-50 transition-colors"
              >
                {a.status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                {a.status === 'loading' ? 'Identifying…' : 'Identify Song'}
              </button>
              <button
                onClick={searchDiscogs}
                disabled={searching || (!a.meta.title && !a.meta.artist)}
                className="w-48 flex items-center justify-center gap-2 border border-border text-foreground text-sm py-2 rounded hover:bg-gray-light disabled:opacity-50 transition-colors"
              >
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                Search Discogs
              </button>
              <button
                onClick={saveTaggedFile}
                disabled={saving}
                className="w-48 flex items-center justify-center gap-2 bg-green-600 text-white text-sm py-2 rounded hover:bg-green-500 disabled:opacity-50 transition-colors"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {saving ? 'Saving…' : 'Download Tagged'}
              </button>
              {saveMsg && <p className="text-xs text-green-400 text-center">{saveMsg}</p>}
            </div>

            {/* Metadata fields */}
            <div className="flex-1 space-y-3 min-w-0">
              <h3 className="text-base font-semibold text-foreground mb-1">{a.name}</h3>
              {(['title', 'artist', 'album', 'year', 'track'] as (keyof Meta)[]).map(field => (
                <div key={field} className="flex items-center gap-3">
                  <label className="w-16 text-sm text-muted capitalize shrink-0">{field}</label>
                  <input
                    value={a.meta[field] as string}
                    onChange={e => updateMeta(activeIdx!, field, e.target.value)}
                    className="flex-1 bg-gray-light border border-border rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              ))}

              {/* Discogs results */}
              {discogs.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">Discogs Results</p>
                    <button onClick={() => setDiscogs([])} className="text-muted hover:text-foreground"><X className="h-4 w-4" /></button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {discogs.map(r => (
                      <button
                        key={r.id}
                        onClick={() => applyDiscogs(r)}
                        className="w-full flex items-center gap-3 bg-gray-light border border-border rounded px-3 py-2 hover:border-accent transition-colors text-left"
                      >
                        {r.thumb ? (
                          <img src={r.thumb} className="w-10 h-10 rounded object-cover shrink-0" alt="" />
                        ) : (
                          <div className="w-10 h-10 bg-border rounded shrink-0 flex items-center justify-center">
                            <Music className="h-5 w-5 text-muted" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{r.artist} — {r.title}</p>
                          <p className="text-xs text-muted truncate">{r.year}{r.label ? ` • ${r.label}` : ''}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}