'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'

const TONES = [
  { value: 'professional', label: 'Professional', emoji: '💼' },
  { value: 'casual', label: 'Casual', emoji: '😊' },
  { value: 'inspiring', label: 'Inspiring', emoji: '✨' },
  { value: 'educational', label: 'Educational', emoji: '📚' },
  { value: 'controversial', label: 'Controversial', emoji: '🔥' },
]

const FORMATS = [
  { value: 'story',        label: 'Story',        badge: 'bg-purple-50 text-purple-700', cursor: 'bg-purple-400' },
  { value: 'listicle',     label: 'Listicle',     badge: 'bg-blue-50 text-blue-700',     cursor: 'bg-blue-400'   },
  { value: 'framework',    label: 'Framework',    badge: 'bg-teal-50 text-teal-700',     cursor: 'bg-teal-400'   },
  { value: 'contrarian',   label: 'Contrarian',   badge: 'bg-rose-50 text-rose-700',     cursor: 'bg-rose-400'   },
  { value: 'data_insight', label: 'Data Insight', badge: 'bg-amber-50 text-amber-700',   cursor: 'bg-amber-400'  },
  { value: 'quick_win',    label: 'Quick Win',    badge: 'bg-emerald-50 text-emerald-700', cursor: 'bg-emerald-400' },
]

const OPTIMAL_CHARS = 1300
const MAX_CHARS = 3000

type PostState = { text: string; isGenerating: boolean; copied: boolean; error: string }

const EMPTY_POST: PostState = { text: '', isGenerating: false, copied: false, error: '' }

function initPosts(): Record<string, PostState> {
  return Object.fromEntries(FORMATS.map(f => [f.value, { ...EMPTY_POST }]))
}

export default function Home() {
  const [topic, setTopic]       = useState('')
  const [tone, setTone]         = useState('professional')
  const [audience, setAudience] = useState('')
  const [posts, setPosts]       = useState<Record<string, PostState>>(initPosts)
  const abortRef = useRef<AbortController | null>(null)

  const isAnyGenerating = Object.values(posts).some(p => p.isGenerating)

  async function generate() {
    if (!topic.trim() || isAnyGenerating) return

    abortRef.current?.abort()
    abortRef.current = new AbortController()
    const ctrl = abortRef.current

    setPosts(Object.fromEntries(FORMATS.map(f => [f.value, { text: '', isGenerating: true, copied: false, error: '' }])))

    FORMATS.forEach(async (format) => {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: topic.trim(), tone, format: format.value, audience: audience.trim() }),
          signal: ctrl.signal,
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Generation failed')
        }

        const reader = res.body!.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          setPosts(prev => ({
            ...prev,
            [format.value]: { ...prev[format.value], text: prev[format.value].text + decoder.decode(value, { stream: true }) },
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
    })
  }

  async function copyPost(formatValue: string) {
    const text = posts[formatValue].text
    if (!text) return
    await navigator.clipboard.writeText(text)
    setPosts(prev => ({ ...prev, [formatValue]: { ...prev[formatValue], copied: true } }))
    setTimeout(() => {
      setPosts(prev => ({ ...prev, [formatValue]: { ...prev[formatValue], copied: false } }))
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0077b5] rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold leading-none">Z</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 leading-tight">Zoltha</h1>
              <p className="text-xs text-gray-500">AI-powered posts that drive real engagement</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← Home
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 items-start">

          {/* ── Left: Input Panel ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 lg:sticky lg:top-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Content Brief</h2>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Topic / Idea <span className="text-red-400">*</span>
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generate() }}
                placeholder="e.g. How I landed 3 clients from a single LinkedIn post with zero followers..."
                className="w-full h-28 px-3 py-2.5 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#0077b5]/40 focus:border-[#0077b5] placeholder-gray-400 transition-colors"
              />
            </div>

            {/* Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Target Audience</label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. SaaS founders, job seekers, startup engineers..."
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077b5]/40 focus:border-[#0077b5] placeholder-gray-400 transition-colors"
              />
            </div>

            {/* Tone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {TONES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTone(t.value)}
                    className={`px-3 py-2 text-sm rounded-lg border text-left transition-all ${
                      tone === t.value
                        ? 'bg-[#0077b5] border-[#0077b5] text-white shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-[#0077b5] hover:text-[#0077b5] bg-white'
                    }`}
                  >
                    <span className="mr-1.5">{t.emoji}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate */}
            <button
              onClick={generate}
              disabled={!topic.trim() || isAnyGenerating}
              className="w-full py-3 rounded-lg bg-[#0077b5] text-white font-semibold text-sm transition-all hover:bg-[#006097] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {isAnyGenerating ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating 6 posts...
                </>
              ) : (
                '✦ Generate All 6 Posts'
              )}
            </button>

            <p className="text-xs text-center text-gray-400">
              Tip: Press{' '}
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">⌘ Enter</kbd>{' '}
              to generate
            </p>

            {/* Format legend */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Generates all formats</p>
              <div className="flex flex-wrap gap-1.5">
                {FORMATS.map(f => (
                  <span key={f.value} className={`text-xs px-2 py-0.5 rounded-full font-medium ${f.badge}`}>
                    {f.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: 6-card Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FORMATS.map((format) => {
              const post = posts[format.value]
              const charCount = post.text.length
              const charColor =
                charCount > MAX_CHARS
                  ? 'text-red-500'
                  : charCount > OPTIMAL_CHARS
                    ? 'text-amber-500'
                    : 'text-emerald-600'

              return (
                <div key={format.value} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col min-h-64">
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${format.badge}`}>
                      {format.label}
                    </span>
                    {post.text && (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-mono tabular-nums ${charColor}`}>
                          {charCount}
                          <span className="text-gray-400">/{OPTIMAL_CHARS}</span>
                        </span>
                        <button
                          onClick={() => copyPost(format.value)}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${
                            post.copied
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {post.copied ? '✓ Copied' : '⎘ Copy'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Error */}
                  {post.error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
                      {post.error}
                    </div>
                  )}

                  {/* Empty state */}
                  {!post.text && !post.isGenerating && !post.error && (
                    <div className="flex-1 flex items-center justify-center text-gray-300 text-sm select-none">
                      —
                    </div>
                  )}

                  {/* Loading skeleton */}
                  {post.isGenerating && !post.text && (
                    <div className="flex-1 space-y-2.5 pt-1">
                      {[80, 100, 60, 90, 50, 75].map((w, i) => (
                        <div
                          key={i}
                          className="h-3 bg-gray-100 rounded animate-pulse"
                          style={{ width: `${w}%` }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Post text */}
                  {post.text && (
                    <div className="flex-1 text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {post.text}
                      {post.isGenerating && (
                        <span className={`inline-block w-0.5 h-[1em] ml-0.5 align-middle animate-pulse ${format.cursor}`} />
                      )}
                    </div>
                  )}

                  {/* Char count bar */}
                  {post.text && !post.isGenerating && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            charCount > MAX_CHARS ? 'bg-red-400' : charCount > OPTIMAL_CHARS ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${Math.min(100, (charCount / MAX_CHARS) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
