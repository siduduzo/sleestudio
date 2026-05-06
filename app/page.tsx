'use client'

import { useState, useRef } from 'react'

const TONES = [
  { value: 'professional', label: 'Professional', emoji: '💼' },
  { value: 'casual', label: 'Casual', emoji: '😊' },
  { value: 'inspiring', label: 'Inspiring', emoji: '✨' },
  { value: 'educational', label: 'Educational', emoji: '📚' },
  { value: 'controversial', label: 'Controversial', emoji: '🔥' },
]

const FORMATS = [
  { value: 'standard', label: 'Standard Post', desc: 'Hook + insights + CTA' },
  { value: 'hook_value', label: 'Hook & Value', desc: 'Bold hook + punchy points' },
  { value: 'story', label: 'Story Format', desc: 'Narrative + lesson' },
  { value: 'list', label: 'List Post', desc: 'Numbered tips/insights' },
  { value: 'poll', label: 'Poll Idea', desc: 'Engaging poll + context' },
]

const OPTIMAL_CHARS = 1300
const MAX_CHARS = 3000

export default function Home() {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('professional')
  const [format, setFormat] = useState('standard')
  const [audience, setAudience] = useState('')
  const [output, setOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  const charCount = output.length
  const charColor =
    charCount > MAX_CHARS
      ? 'text-red-500'
      : charCount > OPTIMAL_CHARS
        ? 'text-amber-500'
        : 'text-emerald-600'

  async function generate() {
    if (!topic.trim() || isGenerating) return

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setOutput('')
    setError('')
    setIsGenerating(true)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          tone,
          format,
          audience: audience.trim(),
        }),
        signal: abortRef.current.signal,
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
        setOutput((prev) => prev + decoder.decode(value, { stream: true }))
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  async function copyToClipboard() {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0077b5] rounded flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold leading-none">in</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 leading-tight">
              LinkedIn Content Engine
            </h1>
            <p className="text-xs text-gray-500">AI-powered posts that drive real engagement</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ── Left: Input Panel ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Content Brief
            </h2>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Topic / Idea <span className="text-red-400">*</span>
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generate()
                }}
                placeholder="e.g. How I landed 3 clients from a single LinkedIn post with zero followers..."
                className="w-full h-28 px-3 py-2.5 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#0077b5]/40 focus:border-[#0077b5] placeholder-gray-400 transition-colors"
              />
            </div>

            {/* Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Target Audience
              </label>
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
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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

            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Post Format</label>
              <div className="space-y-2">
                {FORMATS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f.value)}
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-left flex justify-between items-center transition-all ${
                      format === f.value
                        ? 'bg-[#0077b5]/5 border-[#0077b5] text-[#0077b5]'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className="text-sm font-medium">{f.label}</span>
                    <span className="text-xs text-gray-400">{f.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate */}
            <button
              onClick={generate}
              disabled={!topic.trim() || isGenerating}
              className="w-full py-3 rounded-lg bg-[#0077b5] text-white font-semibold text-sm transition-all hover:bg-[#006097] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating...
                </>
              ) : (
                '✦ Generate Post'
              )}
            </button>
            <p className="text-xs text-center text-gray-400">
              Tip: Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">⌘ Enter</kbd> to generate
            </p>
          </div>

          {/* ── Right: Output Panel ── */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6 min-h-96 flex flex-col">
              {/* Output header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Generated Post
                </h2>
                {output && (
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono tabular-nums ${charColor}`}>
                      {charCount}
                      <span className="text-gray-400">/{OPTIMAL_CHARS}</span>
                    </span>
                    <button
                      onClick={generate}
                      disabled={isGenerating}
                      title="Regenerate"
                      className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40 text-sm"
                    >
                      ↺
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        copied
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {copied ? '✓ Copied!' : '⎘ Copy'}
                    </button>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Empty state */}
              {!output && !isGenerating && !error && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-400 text-xl">
                    ✦
                  </div>
                  <p className="text-sm text-gray-400 max-w-xs">
                    Fill in your brief on the left and click{' '}
                    <strong className="text-gray-500">Generate Post</strong> to get started
                  </p>
                </div>
              )}

              {/* Loading skeleton */}
              {isGenerating && !output && (
                <div className="flex-1 space-y-3 pt-2">
                  {[70, 100, 55, 85, 40].map((w, i) => (
                    <div
                      key={i}
                      className="h-3.5 bg-gray-100 rounded animate-pulse"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
              )}

              {/* Output text */}
              {output && (
                <div className="flex-1">
                  <div className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                    {output}
                    {isGenerating && (
                      <span className="inline-block w-0.5 h-[1em] bg-[#0077b5] ml-0.5 align-middle animate-pulse" />
                    )}
                  </div>
                </div>
              )}

              {/* Character count bar */}
              {output && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>Character count</span>
                    <span>
                      {charCount > MAX_CHARS
                        ? 'Too long — trim for best results'
                        : charCount > OPTIMAL_CHARS
                          ? 'Good length, but shorter gets more reach'
                          : 'Optimal length for LinkedIn reach'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        charCount > MAX_CHARS
                          ? 'bg-red-400'
                          : charCount > OPTIMAL_CHARS
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(100, (charCount / MAX_CHARS) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Tips card */}
            {!output && !isGenerating && (
              <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
                <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2.5">
                  LinkedIn Best Practices
                </h3>
                <ul className="space-y-1.5 text-xs text-blue-600">
                  <li>• First line decides everything — make it impossible to scroll past</li>
                  <li>• Under 1,300 chars gets 3× more algorithmic reach</li>
                  <li>• End with a question to drive comments and boost distribution</li>
                  <li>• Post Tue–Thu at 8–10am or 12pm in your audience&apos;s timezone</li>
                  <li>• Avoid links in the post body — put them in the first comment</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
