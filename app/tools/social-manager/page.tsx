'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Loader2, CheckCircle, XCircle, Instagram, Facebook, Twitter, Linkedin, Music2, Bot, User, RefreshCw } from 'lucide-react'
import { SOCIAL_MANAGER_API } from '../../../lib/api'

// ── Types ──────────────────────────────────────────────────────────────────────

interface PostPreview {
  post_id: number
  platform: string
  content: string
  image_url: string
  scheduled_at: string
}

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  text: string
  pending?: boolean          // streaming in progress
  approvals?: PostPreview[]  // approval cards attached to this message
}

interface PostResult {
  post_id: number
  success: boolean
  message: string
  platform?: string
}

// ── Platform icon helper ───────────────────────────────────────────────────────

function PlatformIcon({ platform, size = 16 }: { platform: string; size?: number }) {
  const cls = `shrink-0`
  const style = { width: size, height: size }
  if (platform === 'instagram') return <Instagram className={cls} style={style} />
  if (platform === 'facebook')  return <Facebook  className={cls} style={style} />
  if (platform === 'twitter')   return <Twitter   className={cls} style={style} />
  if (platform === 'linkedin')  return <Linkedin  className={cls} style={style} />
  if (platform === 'tiktok')    return <Music2    className={cls} style={style} />
  return <Bot className={cls} style={style} />
}

function platformColor(platform: string): string {
  if (platform === 'instagram') return '#E1306C'
  if (platform === 'facebook')  return '#1877F2'
  if (platform === 'twitter')   return '#1DA1F2'
  if (platform === 'linkedin')  return '#0A66C2'
  if (platform === 'tiktok')    return '#010101'
  return 'var(--accent)'
}

// ── Approval card ──────────────────────────────────────────────────────────────

function ApprovalCard({
  post,
  onApprove,
  onReject,
  result,
}: {
  post: PostPreview
  onApprove: (id: number) => void
  onReject: (id: number) => void
  result?: PostResult
}) {
  const color = platformColor(post.platform)

  return (
    <div className="mt-3 rounded-xl border border-border overflow-hidden max-w-md">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ backgroundColor: color + '22', borderBottom: '1px solid var(--border)' }}>
        <PlatformIcon platform={post.platform} size={18} />
        <span className="text-sm font-semibold capitalize" style={{ color }}>{post.platform}</span>
        {post.scheduled_at && post.scheduled_at !== 'immediately after approval' && (
          <span className="ml-auto text-xs text-muted">{post.scheduled_at}</span>
        )}
      </div>

      {/* Image preview */}
      {post.image_url && (
        <img src={post.image_url} alt="Post image" className="w-full max-h-48 object-cover" />
      )}

      {/* Caption */}
      <div className="px-4 py-3">
        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{post.content}</p>
      </div>

      {/* Actions / result */}
      <div className="px-4 pb-3">
        {result ? (
          <div className={`flex items-center gap-2 text-sm ${result.success ? 'text-green-400' : 'text-red-400'}`}>
            {result.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {result.message}
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => onApprove(post.post_id)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-green-600 text-white text-sm hover:bg-green-500 transition-colors"
            >
              <CheckCircle className="h-3.5 w-3.5" /> Approve &amp; Post
            </button>
            <button
              onClick={() => onReject(post.post_id)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-border text-muted text-sm hover:bg-gray-light transition-colors"
            >
              <XCircle className="h-3.5 w-3.5" /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Chat message bubble ────────────────────────────────────────────────────────

function ChatBubble({
  msg,
  postResults,
  onApprove,
  onReject,
}: {
  msg: Message
  postResults: Record<number, PostResult>
  onApprove: (id: number) => void
  onReject: (id: number) => void
}) {
  const isUser = msg.role === 'user'

  if (msg.role === 'system') {
    return (
      <div className="flex justify-center my-2">
        <p className="text-xs text-muted bg-gray-light rounded-full px-3 py-1">{msg.text}</p>
      </div>
    )
  }

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start`}>
      {/* Avatar */}
      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-1 ${isUser ? 'bg-accent' : 'bg-gray-light border border-border'}`}>
        {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-accent" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-accent text-white rounded-tr-sm'
            : 'bg-card-bg border border-border text-foreground rounded-tl-sm'
        }`}>
          {msg.text}
          {msg.pending && <span className="inline-block w-1.5 h-4 bg-current ml-0.5 animate-pulse rounded-sm" />}
        </div>

        {/* Approval cards */}
        {msg.approvals?.map(post => (
          <ApprovalCard
            key={post.post_id}
            post={post}
            onApprove={onApprove}
            onReject={onReject}
            result={postResults[post.post_id]}
          />
        ))}
      </div>
    </div>
  )
}

// ── Starter suggestions ────────────────────────────────────────────────────────

const SUGGESTIONS = [
  'Create an Instagram post about our PC repair service',
  'How did my Instagram posts do last week?',
  'Plan social media posts for this week',
  'Check for unanswered Instagram comments',
]

// ── Main page ──────────────────────────────────────────────────────────────────

export default function SocialManagerPage() {
  const [messages,     setMessages]     = useState<Message[]>([])
  const [input,        setInput]        = useState('')
  const [connected,    setConnected]    = useState(false)
  const [connecting,   setConnecting]   = useState(false)
  const [agentBusy,    setAgentBusy]    = useState(false)
  const [postResults,  setPostResults]  = useState<Record<number, PostResult>>({})

  const wsRef        = useRef<WebSocket | null>(null)
  const sessionId    = useRef(Math.random().toString(36).slice(2))
  const bottomRef    = useRef<HTMLDivElement>(null)
  const pendingMsgId = useRef<string | null>(null)

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── WebSocket connection ─────────────────────────────────────────────────────

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return
    setConnecting(true)

    const wsUrl = SOCIAL_MANAGER_API.replace(/^http/, 'ws')
    const ws = new WebSocket(`${wsUrl}/ws/${sessionId.current}`)
    wsRef.current = ws

    ws.onopen = () => {
      setConnected(true)
      setConnecting(false)
      addSystemMessage('Connected to Social Media Manager')
    }

    ws.onclose = () => {
      setConnected(false)
      setConnecting(false)
    }

    ws.onerror = () => {
      setConnected(false)
      setConnecting(false)
      addSystemMessage('Could not connect. Make sure the API is running.')
    }

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data)

      if (data.type === 'token') {
        // Append streamed token to the current assistant message
        setMessages(prev => prev.map(m =>
          m.id === pendingMsgId.current ? { ...m, text: m.text + data.content } : m
        ))
      } else if (data.type === 'approval_needed') {
        // Attach the approval card to the current assistant message
        setMessages(prev => prev.map(m =>
          m.id === pendingMsgId.current
            ? { ...m, approvals: [...(m.approvals ?? []), data.post] }
            : m
        ))
      } else if (data.type === 'done') {
        // Mark streaming complete
        setMessages(prev => prev.map(m =>
          m.id === pendingMsgId.current ? { ...m, pending: false } : m
        ))
        pendingMsgId.current = null
        setAgentBusy(false)
      } else if (data.type === 'post_result') {
        setPostResults(prev => ({ ...prev, [data.post_id]: data }))
      } else if (data.type === 'error') {
        addSystemMessage(`Error: ${data.message}`)
        setAgentBusy(false)
      }
    }
  }, [])

  useEffect(() => {
    connect()
    return () => wsRef.current?.close()
  }, [connect])

  // ── Helpers ──────────────────────────────────────────────────────────────────

  function addSystemMessage(text: string) {
    setMessages(prev => [...prev, { id: Math.random().toString(36), role: 'system', text }])
  }

  function sendMessage(text: string) {
    if (!text.trim() || agentBusy || !connected) return
    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) return

    // Add user bubble
    setMessages(prev => [...prev, { id: Math.random().toString(36), role: 'user', text }])

    // Add blank assistant bubble (will fill via streaming)
    const assistantId = Math.random().toString(36)
    pendingMsgId.current = assistantId
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', text: '', pending: true }])

    setAgentBusy(true)
    ws.send(JSON.stringify({ type: 'message', content: text }))
  }

  function handleApprove(postId: number) {
    wsRef.current?.send(JSON.stringify({ type: 'approve', post_id: postId }))
  }

  function handleReject(postId: number) {
    wsRef.current?.send(JSON.stringify({ type: 'reject', post_id: postId }))
    setPostResults(prev => ({ ...prev, [postId]: { post_id: postId, success: false, message: 'Rejected' } }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
    setInput('')
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card-bg">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-accent" />
          <span className="text-sm font-bold text-foreground">Social Media Manager</span>
          <div className={`w-2 h-2 rounded-full ml-1 ${connected ? 'bg-green-400' : connecting ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'}`} />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="flex items-center gap-1"><Instagram className="h-3.5 w-3.5 text-pink-400" /> Active</span>
          <span className="flex items-center gap-1 opacity-40"><Facebook className="h-3.5 w-3.5" /> Soon</span>
          <span className="flex items-center gap-1 opacity-40"><Twitter className="h-3.5 w-3.5" /> Soon</span>
          <span className="flex items-center gap-1 opacity-40"><Linkedin className="h-3.5 w-3.5" /> Soon</span>
          <span className="flex items-center gap-1 opacity-40"><Music2 className="h-3.5 w-3.5" /> Soon</span>
          {!connected && (
            <button onClick={connect} className="ml-2 flex items-center gap-1 text-accent hover:text-accent/80">
              <RefreshCw className="h-3.5 w-3.5" /> Reconnect
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
            <div>
              <Bot className="h-12 w-12 text-accent mx-auto mb-3 opacity-60" />
              <p className="text-foreground font-medium">Your Social Media Manager is ready</p>
              <p className="text-sm text-muted mt-1">Tell me what you need — I&apos;ll handle the rest</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg w-full">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => { sendMessage(s) }}
                  disabled={!connected || agentBusy}
                  className="text-left px-4 py-3 rounded-xl border border-border bg-card-bg text-sm text-foreground hover:border-accent hover:text-accent transition-colors disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <ChatBubble
            key={msg.id}
            msg={msg}
            postResults={postResults}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-border bg-card-bg flex gap-2 items-end">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e) } }}
          placeholder={connected ? 'Ask me to post, check analytics, plan content…' : 'Connecting…'}
          disabled={!connected || agentBusy}
          rows={1}
          className="flex-1 bg-gray-light border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted resize-none focus:outline-none focus:border-accent disabled:opacity-50 leading-relaxed"
          style={{ minHeight: 44, maxHeight: 120 }}
        />
        <button
          type="submit"
          disabled={!input.trim() || !connected || agentBusy}
          className="shrink-0 w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent/80 disabled:opacity-40 transition-colors"
        >
          {agentBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  )
}