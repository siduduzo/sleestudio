import Link from 'next/link'

const FORMATS = [
  {
    label: 'Story',
    description: 'Turn your experience into a narrative that keeps readers scrolling.',
    icon: '📖',
    color: 'from-purple-500/20 to-purple-500/5',
    border: 'border-purple-500/30',
    tag: 'bg-purple-500/20 text-purple-300',
  },
  {
    label: 'Listicle',
    description: 'Scannable numbered insights that get saved and reshared.',
    icon: '📋',
    color: 'from-blue-500/20 to-blue-500/5',
    border: 'border-blue-500/30',
    tag: 'bg-blue-500/20 text-blue-300',
  },
  {
    label: 'Framework',
    description: 'A repeatable system or mental model your audience can apply today.',
    icon: '🏗️',
    color: 'from-teal-500/20 to-teal-500/5',
    border: 'border-teal-500/30',
    tag: 'bg-teal-500/20 text-teal-300',
  },
  {
    label: 'Contrarian',
    description: 'Challenge the conventional wisdom and spark debate in the comments.',
    icon: '🔥',
    color: 'from-rose-500/20 to-rose-500/5',
    border: 'border-rose-500/30',
    tag: 'bg-rose-500/20 text-rose-300',
  },
  {
    label: 'Data Insight',
    description: 'Back your take with numbers. Stats-driven posts earn serious authority.',
    icon: '📊',
    color: 'from-amber-500/20 to-amber-500/5',
    border: 'border-amber-500/30',
    tag: 'bg-amber-500/20 text-amber-300',
  },
  {
    label: 'Quick Win',
    description: 'One actionable tip readers can use in the next five minutes.',
    icon: '⚡',
    color: 'from-emerald-500/20 to-emerald-500/5',
    border: 'border-emerald-500/30',
    tag: 'bg-emerald-500/20 text-emerald-300',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 backdrop-blur-sm sticky top-0 z-50 bg-[#0a0a0f]/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0077b5] to-[#004f7c] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">Z</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">Zoltha</span>
          </div>
          <Link
            href="/generate"
            className="px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/15 rounded-lg border border-white/10 transition-colors"
          >
            Open app →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-32 px-6">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0077b5]/15 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/60 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Powered by Claude AI
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            6 LinkedIn posts.{' '}
            <span className="bg-gradient-to-r from-[#0077b5] to-[#38bdf8] bg-clip-text text-transparent">
              One prompt.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Zoltha generates six high-engagement post formats simultaneously — story, listicle, framework, contrarian, data insight, and quick win — so you always have the right angle.
          </p>

          <Link
            href="/generate"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#0077b5] hover:bg-[#006097] text-white font-semibold text-base transition-all active:scale-[0.98] shadow-lg shadow-[#0077b5]/30"
          >
            ✦ Generate your posts
            <span className="text-white/70">→</span>
          </Link>

          <p className="mt-4 text-xs text-white/30">No sign-up required. Free to try.</p>
        </div>
      </section>

      {/* Features — 6 formats */}
      <section className="px-6 pb-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Six formats. Zero guesswork.</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Every topic has multiple angles. Zoltha writes all of them at once so you can pick what lands best with your audience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FORMATS.map((f) => (
              <div
                key={f.label}
                className={`relative rounded-2xl border ${f.border} bg-gradient-to-b ${f.color} p-6 group hover:border-white/20 transition-colors`}
              >
                <div className="mb-4 text-3xl">{f.icon}</div>
                <div className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 ${f.tag}`}>
                  {f.label}
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="px-6 pb-28">
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-white/5 p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0077b5]/10 to-transparent pointer-events-none" />
          <h2 className="relative text-3xl sm:text-4xl font-bold mb-4">Ready to write less,{' '}post more?</h2>
          <p className="relative text-white/50 mb-8">Drop your idea in. Get six polished posts back in seconds.</p>
          <Link
            href="/generate"
            className="relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#0077b5] hover:bg-[#006097] text-white font-semibold transition-all active:scale-[0.98] shadow-lg shadow-[#0077b5]/30"
          >
            ✦ Start generating
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/30">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-[#0077b5] to-[#004f7c] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">Z</span>
            </div>
            <span>Zoltha</span>
          </div>
          <p>AI-powered LinkedIn content engine</p>
        </div>
      </footer>
    </div>
  )
}
