import Link from 'next/link'

const STATS = [
  { number: '6', label: 'formats', sub: 'generated at once' },
  { number: '30s', label: 'to generate', sub: 'from prompt to posts' },
  { number: '0', label: "writer's blocks", sub: 'ever again' },
]

const FORMATS = [
  {
    label: 'Story',
    tagClass: 'text-purple-300 bg-purple-500/15 border-purple-500/30',
    cardBorder: 'border-purple-500/20 hover:border-purple-400/50',
    glow: 'from-purple-600/10',
    avatarGrad: 'from-purple-400 to-purple-700',
    name: 'Alex Morgan',
    role: 'Founder @ Buildfast · 2nd',
    time: '3h',
    preview: 'I was laid off on a Tuesday.\n\nBy Friday, I had 3 job offers.\n\nHere\'s exactly what I did differently in those 72 hours...',
    reactions: 1141,
    comments: 93,
  },
  {
    label: 'Listicle',
    tagClass: 'text-blue-300 bg-blue-500/15 border-blue-500/30',
    cardBorder: 'border-blue-500/20 hover:border-blue-400/50',
    glow: 'from-blue-600/10',
    avatarGrad: 'from-blue-400 to-blue-700',
    name: 'Jordan Reeves',
    role: 'Senior SWE @ Meta · 1st',
    time: '1d',
    preview: '5 things senior engineers never say in meetings:\n\n1. "That\'s not my problem"\n2. "We\'ve always done it this way"\n3. "It\'s impossible"\n\nSave this →',
    reactions: 1839,
    comments: 204,
  },
  {
    label: 'Framework',
    tagClass: 'text-teal-300 bg-teal-500/15 border-teal-500/30',
    cardBorder: 'border-teal-500/20 hover:border-teal-400/50',
    glow: 'from-teal-600/10',
    avatarGrad: 'from-teal-400 to-teal-700',
    name: 'Priya Sharma',
    role: 'VP Product @ Stripe · 2nd',
    time: '5h',
    preview: 'The CLEAR method for feedback:\n\nC — Context\nL — Listen first\nE — Evidence\nA — Action step\nR — Reinforce\n\nI\'ve used this 200+ times. Here\'s how:',
    reactions: 949,
    comments: 71,
  },
  {
    label: 'Contrarian',
    tagClass: 'text-rose-300 bg-rose-500/15 border-rose-500/30',
    cardBorder: 'border-rose-500/20 hover:border-rose-400/50',
    glow: 'from-rose-600/10',
    avatarGrad: 'from-rose-400 to-rose-700',
    name: 'Marcus Chen',
    role: 'CEO @ Outlier · 3rd+',
    time: '2d',
    preview: 'Hot take: Work-life balance is a myth.\n\nBefore you unfollow —\n\nThe highest performers I know don\'t balance work and life. They blend them.\n\nHere\'s why:',
    reactions: 2856,
    comments: 389,
  },
  {
    label: 'Data Insight',
    tagClass: 'text-amber-300 bg-amber-500/15 border-amber-500/30',
    cardBorder: 'border-amber-500/20 hover:border-amber-400/50',
    glow: 'from-amber-600/10',
    avatarGrad: 'from-amber-400 to-amber-600',
    name: 'Taylor Kim',
    role: 'Growth Lead @ Notion · 2nd',
    time: '6h',
    preview: '87% of LinkedIn posts get fewer than 10 reactions.\n\nThe 13% that go viral share one trait.\n\nI analyzed 500 posts to find it.\n\nThe answer will surprise you:',
    reactions: 4511,
    comments: 512,
  },
  {
    label: 'Quick Win',
    tagClass: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
    cardBorder: 'border-emerald-500/20 hover:border-emerald-400/50',
    glow: 'from-emerald-600/10',
    avatarGrad: 'from-emerald-400 to-emerald-700',
    name: 'Sam Okonkwo',
    role: 'PM @ Figma · 1st',
    time: '4h',
    preview: 'Add this to your LinkedIn bio TODAY:\n\n"Open to [specific opportunity]"\n\n30 seconds.\nTripled my inbound in a week.\n\nHere\'s the exact template:',
    reactions: 1198,
    comments: 147,
  },
]

function MockPost({ format }: { format: (typeof FORMATS)[number] }) {
  const lines = format.preview.split('\n')
  const preview = lines.slice(0, 5)
  const truncated = lines.length > 5

  return (
    <div className="rounded-xl bg-[#0d0d16] border border-white/[0.07] p-4 text-xs flex-1">
      {/* Profile row */}
      <div className="flex items-start gap-2.5 mb-3">
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${format.avatarGrad} flex-shrink-0`} />
        <div className="min-w-0">
          <div className="font-semibold text-white/90 text-[11px] truncate">{format.name}</div>
          <div className="text-white/35 text-[10px] truncate">{format.role}</div>
          <div className="text-white/25 text-[10px]">{format.time} · 🌐</div>
        </div>
      </div>

      {/* Post body */}
      <div className="text-white/60 leading-relaxed space-y-0.5 mb-3">
        {preview.map((line, i) =>
          line === '' ? (
            <div key={i} className="h-2" />
          ) : (
            <p key={i}>{line}</p>
          )
        )}
        {truncated && (
          <span className="text-white/35 text-[10px] cursor-pointer hover:text-white/50 transition-colors">
            …see more
          </span>
        )}
      </div>

      {/* Reaction bar */}
      <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.07] text-[10px] text-white/30">
        <span>👍 ❤️ 💡 {format.reactions.toLocaleString()}</span>
        <span>{format.comments} comments</span>
      </div>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">

      {/* Animated gradient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="blob absolute top-[-25%] left-[-12%] w-[700px] h-[700px] bg-[#0077b5]/18 rounded-full blur-[110px]" />
        <div className="blob-slow absolute top-[25%] right-[-18%] w-[600px] h-[600px] bg-purple-600/12 rounded-full blur-[110px]" />
        <div className="blob-slower absolute bottom-[-15%] left-[25%] w-[800px] h-[800px] bg-teal-600/8 rounded-full blur-[130px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-50 border-b border-white/[0.06] backdrop-blur-md sticky top-0 bg-[#050508]/70">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0077b5] to-[#004f7c] flex items-center justify-center shadow-lg shadow-[#0077b5]/30">
              <span className="text-white text-sm font-bold">Z</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">Zoltha</span>
          </div>
          <Link
            href="/generate"
            className="px-4 py-2 text-sm font-medium bg-white/[0.07] hover:bg-white/[0.12] rounded-lg border border-white/10 transition-colors"
          >
            Open app →
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 pt-24 pb-20 px-6 text-center">
        <div className="max-w-5xl mx-auto">

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.05] text-xs text-white/50 mb-10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Used by 2,400+ creators
          </div>

          <h1 className="font-black tracking-tighter leading-[0.92] mb-8">
            <span className="block text-[clamp(3.5rem,10vw,7rem)] text-white">Six formats.</span>
            <span className="block text-[clamp(3.5rem,10vw,7rem)] bg-gradient-to-r from-[#0077b5] via-[#38bdf8] to-[#818cf8] bg-clip-text text-transparent">
              One prompt.
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-white/35 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Type your idea. Get six battle-tested LinkedIn post formats back in seconds — story, listicle, framework, contrarian, data insight, and quick win.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/generate"
              className="group inline-flex items-center gap-3 px-9 py-4 rounded-2xl bg-[#0077b5] hover:bg-[#0088cc] text-white font-bold text-lg transition-all active:scale-[0.98] shadow-2xl shadow-[#0077b5]/40"
            >
              ✦ Generate your posts
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
            <p className="text-sm text-white/25">No sign-up. No credit card.</p>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-6 sm:gap-12 py-10 border-y border-white/[0.06]">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-[clamp(2.5rem,7vw,5rem)] font-black bg-gradient-to-b from-white to-white/30 bg-clip-text text-transparent leading-none mb-2 tabular-nums">
                  {s.number}
                </div>
                <div className="text-sm sm:text-base font-semibold text-white/60">{s.label}</div>
                <div className="text-[11px] text-white/25 mt-0.5 hidden sm:block">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Before / After ── */}
      <section className="relative z-10 px-6 pb-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">The old way vs. Zoltha</h2>
            <p className="text-white/35">Choose your adventure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Before */}
            <div className="rounded-3xl border border-red-500/20 bg-gradient-to-b from-red-950/20 to-transparent p-8 relative overflow-hidden">
              <div className="absolute top-5 right-5 text-[10px] text-red-500/40 font-mono uppercase tracking-widest">before</div>

              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-5">
                  ✕ The old way
                </span>
                <h3 className="text-2xl font-bold text-white/80 leading-tight">
                  Open a blank doc.<br />Stare. Delete. Repeat.
                </h3>
              </div>

              {/* Mock text editor */}
              <div className="rounded-2xl bg-black/50 border border-white/[0.07] overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.03]">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  <span className="ml-2 text-white/20 text-[10px] font-mono">post_draft_v14_FINAL_real_final.txt</span>
                </div>
                <div className="p-4 font-mono text-xs space-y-2.5">
                  <p className="text-white/20 line-through">Ok so I was thinking about leadership and how—</p>
                  <p className="text-white/20 line-through">Have you ever noticed that the best leaders—</p>
                  <p className="text-white/20 line-through">I've been thinking a lot about what it means to—</p>
                  <p className="text-white/20 line-through">Leadership is more than just managing people. It's about—</p>
                  <div className="flex items-center gap-1 text-white/50">
                    <span>Great leaders don</span>
                    <span className="inline-block w-0.5 h-3.5 bg-white/60 animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs">
                <span className="text-red-400/70 flex items-center gap-2">
                  <span>😩</span> 2 hrs 47 min wasted
                </span>
                <span className="text-white/25">1 post. Maybe.</span>
              </div>
            </div>

            {/* After */}
            <div className="rounded-3xl border border-[#0077b5]/30 bg-gradient-to-b from-[#0077b5]/8 to-transparent p-8 relative overflow-hidden">
              <div className="absolute top-5 right-5 text-[10px] text-emerald-400/50 font-mono uppercase tracking-widest">after</div>

              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-5">
                  ✓ With Zoltha
                </span>
                <h3 className="text-2xl font-bold text-white/80 leading-tight">
                  Type your idea once.<br />Get six posts back.
                </h3>
              </div>

              {/* Mock Zoltha UI */}
              <div className="rounded-2xl bg-black/50 border border-white/[0.07] overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.03]">
                  <div className="w-2 h-2 rounded-full bg-[#0077b5]/60" />
                  <span className="ml-2 text-white/20 text-[10px] font-mono">zoltha.app/generate</span>
                </div>
                <div className="p-4 space-y-3 text-xs">
                  <div className="rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2.5 text-white/50 font-mono text-[11px]">
                    "How I grew from 0 to 10k followers in 90 days"
                  </div>
                  <div className="flex items-center gap-2 text-white/40 text-[10px]">
                    <div className="w-3 h-3 rounded-full border-[1.5px] border-emerald-400 border-t-transparent animate-spin flex-shrink-0" />
                    Generating all 6 formats simultaneously...
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Story ✓', 'Listicle ✓', 'Framework ✓', 'Contrarian ✓', 'Data ✓', 'Quick Win ✓'].map((f) => (
                      <span key={f} className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px]">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs">
                <span className="text-emerald-400 flex items-center gap-2">
                  <span>⚡</span> 28 seconds total
                </span>
                <span className="text-white/40 font-medium">6 posts. Done.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Format cards ── */}
      <section className="relative z-10 px-6 pb-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Six formats. All at once.</h2>
            <p className="text-white/35 max-w-lg mx-auto">
              Every angle on your topic, written simultaneously. Pick the one that fits your audience — or post all six.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FORMATS.map((f) => (
              <div
                key={f.label}
                className={`rounded-2xl border ${f.cardBorder} bg-gradient-to-b ${f.glow} to-transparent transition-all duration-300 p-5 flex flex-col gap-4`}
              >
                <span className={`self-start text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full border ${f.tagClass}`}>
                  {f.label.toUpperCase()}
                </span>
                <MockPost format={f} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="relative z-10 px-6 pb-28">
        <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0077b5]/12 via-transparent to-purple-600/8 pointer-events-none" />
          <h2 className="relative text-4xl sm:text-5xl font-black tracking-tight mb-5 leading-tight">
            Your next viral post<br />
            <span className="bg-gradient-to-r from-[#38bdf8] to-[#818cf8] bg-clip-text text-transparent">
              is one prompt away.
            </span>
          </h2>
          <p className="relative text-white/35 mb-10 text-lg">Start generating. It&apos;s free.</p>
          <Link
            href="/generate"
            className="relative inline-flex items-center gap-3 px-9 py-5 rounded-2xl bg-[#0077b5] hover:bg-[#0088cc] text-white font-bold text-lg transition-all active:scale-[0.98] shadow-2xl shadow-[#0077b5]/40"
          >
            ✦ Generate my posts
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.05] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/20">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-[#0077b5] to-[#004f7c] flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">Z</span>
            </div>
            <span className="font-medium text-white/30">Zoltha</span>
          </div>
          <p>© 2025 Zoltha · AI-powered LinkedIn content</p>
        </div>
      </footer>

    </div>
  )
}
