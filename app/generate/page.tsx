'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

const TONES = [
  { value: 'professional',  label: 'Professional',  emoji: '💼' },
  { value: 'casual',        label: 'Casual',         emoji: '😊' },
  { value: 'inspiring',     label: 'Inspiring',      emoji: '✨' },
  { value: 'educational',   label: 'Educational',    emoji: '📚' },
  { value: 'controversial', label: 'Controversial',  emoji: '🔥' },
]

const FORMATS = [
  {
    value: 'story',
    label: 'Story',
    badge:      'text-purple-300 bg-purple-500/10 border-purple-500/25',
    cursor:     'bg-purple-400',
    border:     'border-purple-500/20',
    hoverBorder:'hover:border-purple-400/55',
    glow:       'from-purple-600/8',
    glowShadow: 'hover:shadow-[0_0_40px_-12px_rgba(168,85,247,0.2)]',
    accent:     '#a855f7',
  },
  {
    value: 'listicle',
    label: 'Listicle',
    badge:      'text-blue-300 bg-blue-500/10 border-blue-500/25',
    cursor:     'bg-blue-400',
    border:     'border-blue-500/20',
    hoverBorder:'hover:border-blue-400/55',
    glow:       'from-blue-600/8',
    glowShadow: 'hover:shadow-[0_0_40px_-12px_rgba(59,130,246,0.2)]',
    accent:     '#3b82f6',
  },
  {
    value: 'framework',
    label: 'Framework',
    badge:      'text-teal-300 bg-teal-500/10 border-teal-500/25',
    cursor:     'bg-teal-400',
    border:     'border-teal-500/20',
    hoverBorder:'hover:border-teal-400/55',
    glow:       'from-teal-600/8',
    glowShadow: 'hover:shadow-[0_0_40px_-12px_rgba(20,184,166,0.2)]',
    accent:     '#14b8a6',
  },
  {
    value: 'contrarian',
    label: 'Contrarian',
    badge:      'text-rose-300 bg-rose-500/10 border-rose-500/25',
    cursor:     'bg-rose-400',
    border:     'border-rose-500/20',
    hoverBorder:'hover:border-rose-400/55',
    glow:       'from-rose-600/8',
    glowShadow: 'hover:shadow-[0_0_40px_-12px_rgba(244,63,94,0.2)]',
    accent:     '#f43f5e',
  },
  {
    value: 'data_insight',
    label: 'Data Insight',
    badge:      'text-amber-300 bg-amber-500/10 border-amber-500/25',
    cursor:     'bg-amber-400',
    border:     'border-amber-500/20',
    hoverBorder:'hover:border-amber-400/55',
    glow:       'from-amber-600/8',
    glowShadow: 'hover:shadow-[0_0_40px_-12px_rgba(245,158,11,0.2)]',
    accent:     '#f59e0b',
  },
  {
    value: 'quick_win',
    label: 'Quick Win',
    badge:      'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
    cursor:     'bg-emerald-400',
    border:     'border-emerald-500/20',
    hoverBorder:'hover:border-emerald-400/55',
    glow:       'from-emerald-600/8',
    glowShadow: 'hover:shadow-[0_0_40px_-12px_rgba(16,185,129,0.2)]',
    accent:     '#10b981',
  },
  {
    value: 'carousel',
    label: 'Carousel',
    badge:      'text-orange-300 bg-orange-500/10 border-orange-500/25',
    cursor:     'bg-orange-400',
    border:     'border-orange-500/20',
    hoverBorder:'hover:border-orange-400/55',
    glow:       'from-orange-600/8',
    glowShadow: 'hover:shadow-[0_0_40px_-12px_rgba(249,115,22,0.2)]',
    accent:     '#f97316',
  },
]

const OPTIMAL_CHARS = 1300
const MAX_CHARS = 3000

type PostState = {
  text: string
  isGenerating: boolean
  copied: boolean
  error: string
  hashtags: string[]
  isLoadingHashtags: boolean
  hooks: string[]
  isLoadingHooks: boolean
  showHooks: boolean
  copiedHookIndex: number | null
}

const EMPTY_POST: PostState = {
  text: '', isGenerating: false, copied: false, error: '',
  hashtags: [], isLoadingHashtags: false,
  hooks: [], isLoadingHooks: false, showHooks: false, copiedHookIndex: null,
}

function initPosts(): Record<string, PostState> {
  return Object.fromEntries(FORMATS.map(f => [f.value, { ...EMPTY_POST }]))
}

function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export default function GeneratePage() {
  const [topic, setTopic]       = useState('')
  const [tone, setTone]         = useState('professional')
  const [audience, setAudience] = useState('')
  const [posts, setPosts]       = useState<Record<string, PostState>>(initPosts)
  const abortRef = useRef<AbortController | null>(null)

  const isAnyGenerating = Object.values(posts).some(p => p.isGenerating)
  const hasAnyContent   = Object.values(posts).some(p => p.text || p.error)

  async function fetchHashtags(formatValue: string, text: string) {
    setPosts(prev => ({ ...prev, [formatValue]: { ...prev[formatValue], isLoadingHashtags: true } }))
    try {
      const res = await fetch('/api/hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (res.ok) {
        const { hashtags } = await res.json()
        setPosts(prev => ({ ...prev, [formatValue]: { ...prev[formatValue], hashtags, isLoadingHashtags: false } }))
      } else {
        setPosts(prev => ({ ...prev, [formatValue]: { ...prev[formatValue], isLoadingHashtags: false } }))
      }
    } catch {
      setPosts(prev => ({ ...prev, [formatValue]: { ...prev[formatValue], isLoadingHashtags: false } }))
    }
  }

  async function generate() {
    if (!topic.trim() || isAnyGenerating) return

    abortRef.current?.abort()
    abortRef.current = new AbortController()
    const ctrl = abortRef.current
    const capturedTopic    = topic.trim()
    const capturedTone     = tone
    const capturedAudience = audience.trim()

    setPosts(Object.fromEntries(FORMATS.map(f => [f.value, { ...EMPTY_POST, isGenerating: true }])))

    FORMATS.forEach(async (format) => {
      let accumulated = ''
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: capturedTopic, tone: capturedTone, format: format.value, audience: capturedAudience }),
          signal: ctrl.signal,
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Generation failed')
        }
        const reader  = res.body!.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          accumulated += chunk
          setPosts(prev => ({
            ...prev,
            [format.value]: { ...prev[format.value], text: prev[format.value].text + chunk },
          }))
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setPosts(prev => ({
            ...prev,
            [format.value]: { ...prev[format.value], isGenerating: false, error: err.message },
          }))
        }
        return
      }
      setPosts(prev => ({ ...prev, [format.value]: { ...prev[format.value], isGenerating: false } }))
      if (accumulated) fetchHashtags(format.value, accumulated)
    })
  }

  async function regenerateSingle(formatValue: string) {
    if (!topic.trim() || posts[formatValue].isGenerating) return
    setPosts(prev => ({ ...prev, [formatValue]: { ...EMPTY_POST, isGenerating: true } }))
    let accumulated = ''
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), tone, format: formatValue, audience: audience.trim() }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Generation failed')
      }
      const reader  = res.body!.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        accumulated += chunk
        setPosts(prev => ({
          ...prev,
          [formatValue]: { ...prev[formatValue], text: prev[formatValue].text + chunk },
        }))
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setPosts(prev => ({
          ...prev,
          [formatValue]: { ...prev[formatValue], isGenerating: false, error: err.message },
        }))
      }
      return
    }
    setPosts(prev => ({ ...prev, [formatValue]: { ...prev[formatValue], isGenerating: false } }))
    if (accumulated) fetchHashtags(formatValue, accumulated)
  }

  async function optimizeHook(formatValue: string) {
    const post = posts[formatValue]
    if (!post.text || post.isLoadingHooks) return
    if (post.showHooks) {
      setPosts(prev => ({ ...prev, [formatValue]: { ...prev[formatValue], showHooks: false } }))
      return
    }
    setPosts(prev => ({ ...prev, [formatValue]: { ...prev[formatValue], isLoadingHooks: true, showHooks: true } }))
    try {
      const res = await fetch('/api/hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: post.text, tone }),
      })
      if (res.ok) {
        const { hooks } = await res.json()
        setPosts(prev => ({ ...prev, [formatValue]: { ...prev[formatValue], hooks, isLoadingHooks: false } }))
      } else {
        setPosts(prev => ({ ...prev, [formatValue]: { ...prev[formatValue], isLoadingHooks: false, showHooks: false } }))
      }
    } catch {
      setPosts(prev => ({ ...prev, [formatValue]: { ...prev[formatValue], isLoadingHooks: false, showHooks: false } }))
    }
  }

  async function copyPost(formatValue: string) {
    const text = posts[formatValue].text
    if (!text) return
    await navigator.clipboard.writeText(text)
    setPosts(prev => ({ ...prev, [formatValue]: { ...prev[formatValue], copied: true } }))
    setTimeout(() => setPosts(prev => ({ ...prev, [formatValue]: { ...prev[formatValue], copied: false } })), 2000)
  }

  async function copyHook(formatValue: string, index: number, hookText: string) {
    await navigator.clipboard.writeText(hookText)
    setPosts(prev => ({ ...prev, [formatValue]: { ...prev[formatValue], copiedHookIndex: index } }))
    setTimeout(() => setPosts(prev => ({ ...prev, [formatValue]: { ...prev[formatValue], copiedHookIndex: null } })), 2000)
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="blob absolute -top-[25%] -left-[12%] w-[600px] h-[600px] bg-[#0077b5]/10 rounded-full blur-[110px]" />
        <div className="blob-slow absolute top-[35%] -right-[18%] w-[500px] h-[500px] bg-purple-600/7 rounded-full blur-[110px]" />
        <div className="blob-slower absolute -bottom-[15%] left-[25%] w-[700px] h-[700px] bg-teal-600/5 rounded-full blur-[130px]" />
      </div>

      {/* Dot grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-50" />

      {/* ── Nav ── */}
      <nav className="relative z-50 border-b border-white/[0.06] backdrop-blur-xl sticky top-0 bg-[#050508]/80">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0077b5] to-[#004f7c] flex items-center justify-center shadow-lg shadow-[#0077b5]/25 group-hover:shadow-[#0077b5]/40 transition-shadow">
              <span className="text-white text-sm font-bold">Z</span>
            </div>
            <span className="text-base font-semibold tracking-tight">Zoltha</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-white/30 hover:text-white/60 transition-colors">
              ← Home
            </Link>
            <div className="w-px h-4 bg-white/[0.08]" />
            <UserButton />
          </div>
        </div>
      </nav>

      {/* ── Main layout ── */}
      <main className="relative z-10 max-w-[1440px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">

          {/* ── Glassmorphism Input Panel ── */}
          <div className="lg:sticky lg:top-[73px] rounded-2xl border border-white/[0.09] bg-white/[0.02] backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden">
            {/* Panel header accent */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#0077b5]/50 to-transparent" />

            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-bold text-white/25 uppercase tracking-widest">Content Brief</h2>
                {hasAnyContent && (
                  <span className="text-[10px] text-emerald-400/70 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                    Generated
                  </span>
                )}
              </div>

              {/* Topic */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-white/45">
                  Topic / Idea <span className="text-[#0077b5]">*</span>
                </label>
                <textarea
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generate() }}
                  placeholder="e.g. How I landed 3 clients from a single LinkedIn post with zero followers..."
                  className="w-full h-28 px-3.5 py-3 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl resize-none text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#0077b5]/50 focus:border-[#0077b5]/40 transition-all leading-relaxed"
                />
              </div>

              {/* Audience */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-white/45">Target Audience</label>
                <input
                  type="text"
                  value={audience}
                  onChange={e => setAudience(e.target.value)}
                  placeholder="e.g. SaaS founders, job seekers..."
                  className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-[#0077b5]/50 focus:border-[#0077b5]/40 transition-all"
                />
              </div>

              {/* Tone */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-white/45">Tone</label>
                <div className="grid grid-cols-2 gap-1.5 xl:grid-cols-3">
                  {TONES.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={`px-3 py-2 text-[11px] rounded-lg border text-left transition-all duration-150 ${
                        tone === t.value
                          ? 'bg-[#0077b5]/25 border-[#0077b5]/55 text-white shadow-lg shadow-[#0077b5]/10'
                          : 'border-white/[0.07] bg-white/[0.02] text-white/40 hover:border-white/[0.15] hover:text-white/65 hover:bg-white/[0.05]'
                      }`}
                    >
                      <span className="mr-1.5 text-xs">{t.emoji}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.06]" />

              {/* Generate button */}
              <button
                onClick={generate}
                disabled={!topic.trim() || isAnyGenerating}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0077b5] to-[#0088d4] text-white font-bold text-sm transition-all active:scale-[0.99] disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-xl shadow-[#0077b5]/20 hover:shadow-[#0077b5]/35 hover:from-[#0080bf] hover:to-[#0099e0]"
              >
                {isAnyGenerating ? (
                  <>
                    <Spinner className="w-4 h-4" />
                    Generating 7 posts…
                  </>
                ) : (
                  '✦ Generate All 7 Posts'
                )}
              </button>

              <p className="text-[11px] text-center text-white/18">
                <kbd className="px-1.5 py-0.5 bg-white/[0.06] border border-white/[0.09] rounded font-mono text-white/30 text-[10px]">⌘ Enter</kbd>
                {' '}to generate
              </p>

              {/* Format pills */}
              <div className="pt-1 border-t border-white/[0.05] space-y-2">
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">All formats</p>
                <div className="flex flex-wrap gap-1.5">
                  {FORMATS.map(f => (
                    <span key={f.value} className={`text-[9px] font-bold tracking-wide px-2 py-0.5 rounded-full border ${f.badge}`}>
                      {f.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Post Cards Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FORMATS.map(format => {
              const post      = posts[format.value]
              const charCount = post.text.length
              const charColor = charCount > MAX_CHARS
                ? 'text-red-400'
                : charCount > OPTIMAL_CHARS
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              const hasContent = !!(post.text || post.error)

              return (
                <div
                  key={format.value}
                  className={`group rounded-2xl border ${format.border} ${format.hoverBorder} bg-gradient-to-b ${format.glow} to-transparent bg-[#07070e] transition-all duration-300 ${format.glowShadow} hover:-translate-y-0.5 flex flex-col min-h-64`}
                >
                  {/* Card top accent line */}
                  <div
                    className="h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl"
                    style={{ background: `linear-gradient(90deg, transparent, ${format.accent}40, transparent)` }}
                  />

                  <div className="p-4 flex flex-col flex-1">
                    {/* Card header */}
                    <div className="flex items-center justify-between mb-3.5">
                      <span className={`text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full border ${format.badge}`}>
                        {format.label.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {post.text && (
                          <span className={`text-[10px] font-mono tabular-nums ${charColor}`}>
                            {charCount}<span className="text-white/20">/{OPTIMAL_CHARS}</span>
                          </span>
                        )}
                        {post.text && (
                          <button
                            onClick={() => copyPost(format.value)}
                            className={`px-2 py-1 rounded-lg border text-[10px] font-medium transition-all duration-150 ${
                              post.copied
                                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                                : 'border-white/[0.09] text-white/40 hover:bg-white/[0.06] hover:text-white/65 hover:border-white/[0.18]'
                            }`}
                          >
                            {post.copied ? '✓ Copied' : '⎘ Copy'}
                          </button>
                        )}
                        {hasContent && !post.isGenerating && topic.trim() && (
                          <button
                            onClick={() => regenerateSingle(format.value)}
                            title="Regenerate"
                            className="px-2 py-1 rounded-lg border border-white/[0.09] text-[10px] font-medium text-white/40 hover:bg-white/[0.06] hover:text-white/65 hover:border-white/[0.18] transition-all duration-150"
                          >
                            ↻
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Error */}
                    {post.error && (
                      <div className="p-3 rounded-xl bg-red-500/8 border border-red-500/20 text-[11px] text-red-400">
                        {post.error}
                      </div>
                    )}

                    {/* Empty state */}
                    {!post.text && !post.isGenerating && !post.error && (
                      <div className="flex-1 flex flex-col items-center justify-center gap-2 select-none">
                        <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/15 text-sm">
                          ✦
                        </div>
                        <p className="text-white/15 text-xs">Waiting for prompt</p>
                      </div>
                    )}

                    {/* Skeleton shimmer */}
                    {post.isGenerating && !post.text && (
                      <div className="flex-1 space-y-2 pt-1">
                        {[82, 100, 64, 88, 52, 76, 95, 60].map((w, i) => (
                          <div
                            key={i}
                            className="h-3 rounded-full skeleton"
                            style={{ width: `${w}%` }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Post text */}
                    {post.text && (
                      <div className="flex-1 text-[11px] text-white/60 leading-[1.7] whitespace-pre-wrap">
                        {post.text}
                        {post.isGenerating && (
                          <span
                            className={`inline-block w-[3px] h-[0.95em] ml-0.5 align-middle animate-pulse rounded-sm ${format.cursor}`}
                          />
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    {post.text && !post.isGenerating && (
                      <div className="mt-4 pt-3.5 border-t border-white/[0.06] space-y-3">

                        {/* Char progress bar */}
                        <div className="h-[3px] bg-white/[0.05] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              charCount > MAX_CHARS ? 'bg-red-400' : charCount > OPTIMAL_CHARS ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                            style={{ width: `${Math.min(100, (charCount / MAX_CHARS) * 100)}%` }}
                          />
                        </div>

                        {/* Hashtags */}
                        {(post.hashtags.length > 0 || post.isLoadingHashtags) && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {post.isLoadingHashtags ? (
                              [36, 52, 44].map((w, i) => (
                                <div key={i} className="h-4 rounded-full skeleton" style={{ width: `${w}px` }} />
                              ))
                            ) : (
                              post.hashtags.map((tag, i) => (
                                <span key={i} className="text-[10px] font-medium text-[#38bdf8] bg-[#0077b5]/12 border border-[#0077b5]/22 px-2 py-0.5 rounded-full">
                                  #{tag}
                                </span>
                              ))
                            )}
                          </div>
                        )}

                        {/* Hook optimizer */}
                        <div>
                          <button
                            onClick={() => optimizeHook(format.value)}
                            disabled={post.isLoadingHooks}
                            className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border transition-all duration-150 ${
                              post.showHooks
                                ? 'bg-violet-500/12 border-violet-500/28 text-violet-300'
                                : 'border-white/[0.09] bg-white/[0.02] text-white/35 hover:bg-white/[0.06] hover:text-white/60 hover:border-white/[0.15]'
                            } disabled:opacity-40`}
                          >
                            {post.isLoadingHooks ? (
                              <span className="flex items-center gap-1.5">
                                <Spinner className="w-3 h-3" />
                                Optimizing…
                              </span>
                            ) : post.showHooks ? '▾ Hide hooks' : '⚡ Optimize hook'}
                          </button>

                          {post.showHooks && post.hooks.length > 0 && (
                            <div className="mt-2 space-y-1.5">
                              {post.hooks.map((hook, i) => (
                                <div
                                  key={i}
                                  className="flex items-start gap-2 p-2.5 rounded-xl bg-violet-500/8 border border-violet-500/18 group/hook"
                                >
                                  <span className="text-[9px] font-bold text-violet-400/60 mt-0.5 shrink-0 font-mono">{i + 1}</span>
                                  <p className="flex-1 text-[11px] text-white/60 leading-snug">{hook}</p>
                                  <button
                                    onClick={() => copyHook(format.value, i, hook)}
                                    className={`shrink-0 text-[9px] font-medium px-1.5 py-0.5 rounded border transition-all opacity-0 group-hover/hook:opacity-100 ${
                                      post.copiedHookIndex === i
                                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                                        : 'border-violet-500/25 text-violet-400 hover:bg-violet-500/12'
                                    }`}
                                  >
                                    {post.copiedHookIndex === i ? '✓' : '⎘'}
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </main>
    </div>
  )
}
