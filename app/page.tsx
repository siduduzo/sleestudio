import Link from 'next/link'
import NavUser from './components/NavUser'

// ── Showcase data ────────────────────────────────────────────────────────────

const FORMATS = [
  {
    label: 'Story',
    tag: 'text-purple-300 bg-purple-500/10 border-purple-500/25',
    border: 'border-purple-500/20',
    hover: 'hover:border-purple-400/50 hover:shadow-[0_0_30px_-8px_rgba(168,85,247,0.15)]',
    glow: 'from-purple-600/8',
    avatar: 'from-purple-500 to-purple-800',
    name: 'Alex Morgan',
    role: 'Founder @ Buildfast · 2nd',
    time: '3h',
    preview: 'I was laid off on a Tuesday.\n\nBy Friday, I had 3 job offers.\n\nHere\'s exactly what I did differently in those 72 hours that nobody talks about...',
    reactions: 1141,
    comments: 93,
  },
  {
    label: 'Listicle',
    tag: 'text-blue-300 bg-blue-500/10 border-blue-500/25',
    border: 'border-blue-500/20',
    hover: 'hover:border-blue-400/50 hover:shadow-[0_0_30px_-8px_rgba(59,130,246,0.15)]',
    glow: 'from-blue-600/8',
    avatar: 'from-blue-500 to-blue-800',
    name: 'Jordan Reeves',
    role: 'Senior SWE @ Meta · 1st',
    time: '1d',
    preview: '5 things senior engineers never say in meetings:\n\n1. "That\'s not my problem"\n2. "We\'ve always done it this way"\n3. "It\'s impossible"\n\nSave this →',
    reactions: 1839,
    comments: 204,
  },
  {
    label: 'Framework',
    tag: 'text-teal-300 bg-teal-500/10 border-teal-500/25',
    border: 'border-teal-500/20',
    hover: 'hover:border-teal-400/50 hover:shadow-[0_0_30px_-8px_rgba(20,184,166,0.15)]',
    glow: 'from-teal-600/8',
    avatar: 'from-teal-500 to-teal-800',
    name: 'Priya Sharma',
    role: 'VP Product @ Stripe · 2nd',
    time: '5h',
    preview: 'The CLEAR method for feedback:\n\nC — Context first\nL — Listen before talking\nE — Evidence only\nA — Action, not blame\nR — Reinforce what worked\n\nI\'ve used this 200+ times. Here\'s how:',
    reactions: 949,
    comments: 71,
  },
  {
    label: 'Contrarian',
    tag: 'text-rose-300 bg-rose-500/10 border-rose-500/25',
    border: 'border-rose-500/20',
    hover: 'hover:border-rose-400/50 hover:shadow-[0_0_30px_-8px_rgba(244,63,94,0.15)]',
    glow: 'from-rose-600/8',
    avatar: 'from-rose-500 to-rose-800',
    name: 'Marcus Chen',
    role: 'CEO @ Outlier · 3rd+',
    time: '2d',
    preview: 'Hot take: Work-life balance is a myth.\n\nBefore you unfollow —\n\nThe highest performers I know don\'t balance work and life. They blend them.\n\nHere\'s why this distinction matters:',
    reactions: 2856,
    comments: 389,
  },
  {
    label: 'Data Insight',
    tag: 'text-amber-300 bg-amber-500/10 border-amber-500/25',
    border: 'border-amber-500/20',
    hover: 'hover:border-amber-400/50 hover:shadow-[0_0_30px_-8px_rgba(245,158,11,0.15)]',
    glow: 'from-amber-600/8',
    avatar: 'from-amber-500 to-amber-700',
    name: 'Taylor Kim',
    role: 'Growth Lead @ Notion · 2nd',
    time: '6h',
    preview: '87% of LinkedIn posts get fewer than 10 reactions.\n\nThe 13% that go viral share one trait.\n\nI analyzed 500 posts to find it.\n\nThe answer surprised me:',
    reactions: 4511,
    comments: 512,
  },
  {
    label: 'Quick Win',
    tag: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
    border: 'border-emerald-500/20',
    hover: 'hover:border-emerald-400/50 hover:shadow-[0_0_30px_-8px_rgba(16,185,129,0.15)]',
    glow: 'from-emerald-600/8',
    avatar: 'from-emerald-500 to-emerald-800',
    name: 'Sam Okonkwo',
    role: 'PM @ Figma · 1st',
    time: '4h',
    preview: 'Add this to your LinkedIn bio TODAY:\n\n"Open to [specific opportunity]"\n\n30 seconds of editing.\nTripled my inbound messages in a week.\n\nHere\'s the exact template I used:',
    reactions: 1198,
    comments: 147,
  },
  {
    label: 'Carousel',
    tag: 'text-orange-300 bg-orange-500/10 border-orange-500/25',
    border: 'border-orange-500/20',
    hover: 'hover:border-orange-400/50 hover:shadow-[0_0_30px_-8px_rgba(249,115,22,0.15)]',
    glow: 'from-orange-600/8',
    avatar: 'from-orange-500 to-orange-800',
    name: 'Devon Clarke',
    role: 'Content Lead @ HubSpot · 2nd',
    time: '8h',
    preview: 'Slide 1: I 10x\'d my LinkedIn reach in 30 days without posting more. Here\'s the 7-slide playbook →\n\nSlide 2: Stop chasing followers. Chase conversations.\n\nSlide 3: One post at the wrong time = invisible.',
    reactions: 3247,
    comments: 418,
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Drop your idea',
    body: 'Any topic, angle, or experience. A sentence is enough. The more specific, the better the output.',
    icon: '✦',
  },
  {
    n: '02',
    title: 'Six formats generate in parallel',
    body: 'Story, listicle, framework, contrarian, data insight, quick win, carousel — all written simultaneously in under 30 seconds.',
    icon: '⚡',
  },
  {
    n: '03',
    title: 'Pick, sharpen, and post',
    body: 'Choose your format, optimize the hook with AI, grab hashtags, copy to clipboard. Done.',
    icon: '→',
  },
]

const FEATURES = [
  {
    icon: '⚡',
    title: 'Parallel generation',
    body: 'All six formats are generated simultaneously — not sequentially. You see results streaming in within seconds, not minutes.',
    accent: 'text-[#38bdf8]',
    border: 'border-[#0077b5]/20 hover:border-[#0077b5]/45',
    glow: 'from-[#0077b5]/6',
  },
  {
    icon: '🎯',
    title: 'Hook optimizer',
    body: 'AI rewrites your opening line three different ways. The first line is all anyone sees before they click. Make it count.',
    accent: 'text-violet-300',
    border: 'border-violet-500/20 hover:border-violet-500/45',
    glow: 'from-violet-600/6',
  },
  {
    icon: '✦',
    title: 'Smart hashtags',
    body: 'Three relevant hashtags auto-generated per post. No guessing. No generic #leadership garbage.',
    accent: 'text-emerald-300',
    border: 'border-emerald-500/20 hover:border-emerald-500/45',
    glow: 'from-emerald-600/6',
  },
]

// ── Sub-components ───────────────────────────────────────────────────────────

function HeroMockup() {
  const cards = [
    {
      label: 'STORY', border: 'border-purple-500/25', glow: 'from-purple-600/8',
      tag: 'text-purple-300 bg-purple-500/10 border-purple-500/25', w: [88, 100, 68, 92, 58],
    },
    {
      label: 'LISTICLE', border: 'border-blue-500/25', glow: 'from-blue-600/8',
      tag: 'text-blue-300 bg-blue-500/10 border-blue-500/25', w: [72, 100, 84, 55, 78],
    },
    {
      label: 'FRAMEWORK', border: 'border-teal-500/25', glow: 'from-teal-600/8',
      tag: 'text-teal-300 bg-teal-500/10 border-teal-500/25', w: [94, 78, 100, 62, 70],
    },
    {
      label: 'CONTRARIAN', border: 'border-rose-500/25', glow: 'from-rose-600/8',
      tag: 'text-rose-300 bg-rose-500/10 border-rose-500/25', w: [66, 100, 82, 74, 90],
    },
  ]

  return (
    <div className="relative w-full max-w-5xl mx-auto mt-20 fade-up-5">
      <div className="absolute inset-x-0 top-1/4 h-80 bg-[#0077b5]/10 blur-[80px] -z-10" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-purple-600/6 blur-[60px] -z-10" />

      <div className="rounded-2xl border border-white/[0.09] bg-[#07070e] overflow-hidden shadow-2xl shadow-black/80">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.06] bg-black/20">
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2.5 h-2.5 rounded-full bg-white/[0.07]" />
            ))}
          </div>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-md px-3 py-1 w-52">
              <div className="w-1.5 h-1.5 rounded-full bg-[#0077b5]/60 flex-shrink-0" />
              <span className="text-[9px] text-white/25 font-mono">zoltha.app/generate</span>
            </div>
          </div>
          <div className="w-14" />
        </div>

        {/* App layout */}
        <div className="grid grid-cols-[200px_1fr]">
          {/* Left panel */}
          <div className="border-r border-white/[0.05] p-4 space-y-3 bg-white/[0.01]">
            <div className="text-[8px] text-white/25 font-semibold uppercase tracking-widest">Content Brief</div>
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-2.5 min-h-[52px]">
              <span className="text-[9px] text-[#38bdf8]/65 font-mono leading-relaxed">
                &quot;How I grew from 0 to 10k LinkedIn followers in 90 days&quot;
              </span>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-[8px] text-white/20">
              SaaS founders, creators...
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[['💼', 'Pro', true], ['😊', 'Casual', false], ['✨', 'Inspiring', false], ['🔥', 'Bold', false]].map(([em, lb, active], i) => (
                <div key={i} className={`text-[8px] px-2 py-1 rounded-lg border text-center ${active ? 'bg-[#0077b5]/20 border-[#0077b5]/40 text-[#38bdf8]' : 'border-white/[0.06] text-white/20'}`}>
                  {em} {lb}
                </div>
              ))}
            </div>
            <div className="w-full py-1.5 bg-gradient-to-r from-[#0077b5] to-[#0088d4] rounded-xl text-[8px] text-white font-bold text-center shadow-lg shadow-[#0077b5]/20">
              ✦ Generate All 6
            </div>
          </div>

          {/* Post cards grid */}
          <div className="p-4 grid grid-cols-2 gap-2.5">
            {cards.map((card, i) => (
              <div key={i} className={`rounded-xl border ${card.border} bg-gradient-to-b ${card.glow} to-transparent p-3`}>
                <span className={`inline-block text-[7px] font-bold px-2 py-0.5 rounded-full border ${card.tag}`}>
                  {card.label}
                </span>
                <div className="mt-2.5 space-y-1.5">
                  {card.w.map((w, j) => (
                    <div key={j} className="h-[5px] bg-white/[0.08] rounded-full" style={{ width: `${w}%` }} />
                  ))}
                </div>
                <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center gap-2">
                  <div className="h-3 bg-white/[0.05] rounded-full w-10" />
                  <div className="h-3 bg-white/[0.05] rounded-full w-14" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ShowcaseCard({ format }: { format: typeof FORMATS[number] }) {
  const lines = format.preview.split('\n')
  const preview = lines.slice(0, 5)
  const truncated = lines.length > 5

  return (
    <div className={`group rounded-2xl border ${format.border} bg-gradient-to-b ${format.glow} to-transparent bg-[#07070e] p-5 flex flex-col gap-4 transition-all duration-300 ${format.hover} cursor-default`}>
      <span className={`self-start text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border ${format.tag}`}>
        {format.label.toUpperCase()}
      </span>

      <div className="rounded-xl bg-black/30 border border-white/[0.06] p-4 flex-1">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${format.avatar} flex-shrink-0`} />
          <div className="min-w-0">
            <div className="font-semibold text-white/85 text-[11px] truncate">{format.name}</div>
            <div className="text-white/35 text-[10px] truncate">{format.role}</div>
            <div className="text-white/20 text-[10px]">{format.time} · 🌐</div>
          </div>
        </div>

        <div className="text-[11px] text-white/55 leading-relaxed space-y-0.5 mb-3">
          {preview.map((line, i) =>
            line === '' ? (
              <div key={i} className="h-2" />
            ) : (
              <p key={i}>{line}</p>
            )
          )}
          {truncated && (
            <span className="text-white/30 text-[10px]">…see more</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.06] text-[10px] text-white/25">
          <span>👍 ❤️ 💡 {format.reactions.toLocaleString()}</span>
          <span>{format.comments} comments</span>
        </div>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="blob absolute -top-[30%] -left-[15%] w-[800px] h-[800px] bg-[#0077b5]/14 rounded-full blur-[120px]" />
        <div className="blob-slow absolute top-[20%] -right-[20%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="blob-slower absolute -bottom-[20%] left-[20%] w-[900px] h-[900px] bg-teal-600/7 rounded-full blur-[140px]" />
      </div>

      {/* Dot grid overlay */}
      <div className="fixed inset-0 grid-bg pointer-events-none z-0 opacity-60" />

      {/* ── Nav ── */}
      <nav className="relative z-50 border-b border-white/[0.06] backdrop-blur-xl sticky top-0 bg-[#050508]/75">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0077b5] to-[#004f7c] flex items-center justify-center shadow-lg shadow-[#0077b5]/30">
              <span className="text-white text-sm font-bold">Z</span>
            </div>
            <span className="text-base font-semibold tracking-tight">Zoltha</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-sm text-white/40 hover:text-white/75 transition-colors">How it works</a>
            <a href="#formats" className="text-sm text-white/40 hover:text-white/75 transition-colors">Formats</a>
            <a href="#pricing" className="text-sm text-white/40 hover:text-white/75 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <NavUser />
            <Link
              href="/generate"
              className="px-4 py-2 text-sm font-semibold bg-white text-[#050508] rounded-lg hover:bg-white/90 transition-colors shadow-lg shadow-white/10"
            >
              Open app →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 pt-28 pb-10 px-6 text-center">
        <div className="max-w-4xl mx-auto">

          <div className="fade-up-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.10] bg-white/[0.04] text-xs text-white/45 mb-10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Trusted by 2,400+ LinkedIn creators
          </div>

          <h1 className="font-black tracking-tighter leading-[0.9] mb-6">
            <span className="fade-up-2 block text-[clamp(4rem,11vw,8.5rem)] text-white">
              Six posts.
            </span>
            <span className="fade-up-3 block text-[clamp(4rem,11vw,8.5rem)] bg-gradient-to-r from-[#0077b5] via-[#38bdf8] to-[#818cf8] bg-clip-text text-transparent gradient-pan">
              One prompt.
            </span>
          </h1>

          <p className="fade-up-4 text-lg sm:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Type your idea. Get six battle-tested LinkedIn formats back in 30 seconds —
            story, listicle, framework, contrarian, data insight, quick win, and carousel.
          </p>

          <div className="fade-up-4 flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/generate"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#0077b5] hover:bg-[#0088cc] text-white font-bold text-base transition-all active:scale-[0.98] shadow-2xl shadow-[#0077b5]/35"
            >
              ✦ Start for free
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border border-white/[0.10] text-white/50 hover:text-white/80 hover:border-white/20 text-sm font-medium transition-all backdrop-blur-sm"
            >
              See how it works
            </a>
          </div>

          {/* Stat strip */}
          <div className="fade-up-4 flex items-center justify-center gap-8 sm:gap-14 py-6 border-y border-white/[0.06] mb-4">
            {[
              { n: '2,400+', l: 'creators' },
              { n: '6', l: 'formats at once' },
              { n: '30s', l: 'average' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">{s.n}</div>
                <div className="text-xs text-white/30 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>

          <HeroMockup />
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="relative z-10 px-6 pt-28 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] text-white/35 mb-6">
              ✦ How it works
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Three steps.{' '}
              <span className="bg-gradient-to-r from-[#38bdf8] to-[#818cf8] bg-clip-text text-transparent">
                Thirty seconds.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

            {STEPS.map((step, i) => (
              <div key={i} className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm p-7 hover:border-white/[0.12] hover:bg-white/[0.03] transition-all duration-300">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.09] flex items-center justify-center text-lg">
                    {step.icon}
                  </div>
                  <span className="text-[11px] font-bold text-white/20 font-mono tracking-widest">{step.n}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Format showcase ── */}
      <section id="formats" className="relative z-10 px-6 pb-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] text-white/35 mb-6">
              ✦ Seven formats
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Every angle.{' '}
              <span className="bg-gradient-to-r from-[#0077b5] via-[#38bdf8] to-[#818cf8] bg-clip-text text-transparent">
                All at once.
              </span>
            </h2>
            <p className="text-white/35 max-w-lg mx-auto text-base font-light leading-relaxed">
              Seven formats engineered for LinkedIn&apos;s algorithm, generated simultaneously.
              Pick the one that fits your voice — or post all six.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FORMATS.map(f => (
              <ShowcaseCard key={f.label} format={f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 px-6 pb-28">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Built for people who{' '}
              <span className="bg-gradient-to-r from-[#38bdf8] to-[#818cf8] bg-clip-text text-transparent">
                actually post.
              </span>
            </h2>
            <p className="text-white/35 max-w-md mx-auto text-base font-light">
              Every feature exists because creating content should be fast, not frustrating.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className={`rounded-2xl border ${f.border} bg-gradient-to-b ${f.glow} to-transparent bg-white/[0.02] p-7 transition-all duration-300`}>
                <div className={`text-2xl mb-5 ${f.accent}`}>{f.icon}</div>
                <h3 className="text-lg font-bold text-white mb-3">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="relative z-10 px-6 pb-28">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] text-white/35 mb-6">
              ✦ Pricing
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
              Simple.{' '}
              <span className="bg-gradient-to-r from-[#38bdf8] to-[#818cf8] bg-clip-text text-transparent">
                Transparent.
              </span>
            </h2>
            <p className="text-white/35 text-base font-light">Start free. Upgrade when you&apos;re ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            {/* Free */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 flex flex-col">
              <div className="mb-8">
                <p className="text-[10px] font-bold text-white/35 uppercase tracking-widest mb-4">Free</p>
                <div className="flex items-end gap-1.5 mb-2">
                  <span className="text-5xl font-black text-white">$0</span>
                  <span className="text-white/30 mb-2 text-sm">/month</span>
                </div>
                <p className="text-sm text-white/30">Everything you need to get started.</p>
              </div>
              <ul className="space-y-3 mb-10 flex-1">
                {['5 generations per day', 'All 7 post formats', 'Hook optimizer', 'Smart hashtags', 'Copy to clipboard'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/50">
                    <span className="w-4 h-4 rounded-full border border-white/15 flex items-center justify-center text-[9px] text-white/30 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/generate" className="block text-center py-3.5 rounded-xl border border-white/[0.12] text-white/55 font-semibold text-sm hover:bg-white/[0.05] hover:text-white/80 transition-all">
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border border-[#0077b5]/40 bg-gradient-to-b from-[#0077b5]/10 to-transparent p-8 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-20 bg-[#0077b5]/20 blur-[50px] pointer-events-none" />
              <div className="relative mb-8">
                <div className="flex items-center gap-2.5 mb-4">
                  <p className="text-[10px] font-bold text-[#38bdf8] uppercase tracking-widest">Pro</p>
                  <span className="px-2 py-0.5 rounded-full bg-[#0077b5]/25 border border-[#0077b5]/40 text-[9px] font-bold text-[#38bdf8] tracking-wide">
                    MOST POPULAR
                  </span>
                </div>
                <div className="flex items-end gap-1.5 mb-2">
                  <span className="text-5xl font-black text-white">$19</span>
                  <span className="text-white/30 mb-2 text-sm">/month</span>
                </div>
                <p className="text-sm text-white/30">For serious creators and teams.</p>
              </div>
              <ul className="relative space-y-3 mb-10 flex-1">
                {['Unlimited generations', 'All 7 post formats', 'Hook optimizer', 'Smart hashtags', 'Post history', 'Custom tone presets', 'Priority speed'].map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                    <span className="w-4 h-4 rounded-full bg-[#0077b5]/30 border border-[#0077b5]/50 flex items-center justify-center text-[9px] text-[#38bdf8] flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/generate" className="relative block text-center py-3.5 rounded-xl bg-[#0077b5] hover:bg-[#0088cc] text-white font-bold text-sm transition-all active:scale-[0.98] shadow-2xl shadow-[#0077b5]/30">
                ✦ Start with Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative z-10 px-6 pb-28">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0077b5]/10 via-transparent to-purple-600/8 pointer-events-none rounded-3xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#0077b5]/15 blur-[60px] pointer-events-none" />
            <div className="relative">
              <p className="text-xs font-bold text-white/25 uppercase tracking-widest mb-6">Ready to start?</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-5 leading-tight">
                Your next viral post
                <br />
                <span className="bg-gradient-to-r from-[#38bdf8] to-[#818cf8] bg-clip-text text-transparent">
                  is one prompt away.
                </span>
              </h2>
              <p className="text-white/35 mb-10 text-base font-light">Start generating. It&apos;s free.</p>
              <Link
                href="/generate"
                className="inline-flex items-center gap-3 px-9 py-5 rounded-2xl bg-[#0077b5] hover:bg-[#0088cc] text-white font-bold text-base transition-all active:scale-[0.98] shadow-2xl shadow-[#0077b5]/35"
              >
                ✦ Generate my posts
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.05] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-[#0077b5] to-[#004f7c] flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">Z</span>
            </div>
            <span className="text-sm font-semibold text-white/30">Zoltha</span>
          </div>
          <p className="text-xs text-white/20">© 2025 Zoltha · AI-powered LinkedIn content</p>
          <div className="flex items-center gap-6">
            <a href="#how" className="text-xs text-white/20 hover:text-white/45 transition-colors">How it works</a>
            <a href="#pricing" className="text-xs text-white/20 hover:text-white/45 transition-colors">Pricing</a>
            <Link href="/generate" className="text-xs text-white/20 hover:text-white/45 transition-colors">App</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
