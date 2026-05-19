import Link from 'next/link'

export default function UpgradeSuccessPage() {
  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-3xl">
          ✓
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">You&apos;re now Pro</h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Unlimited generations are unlocked. Go create something great.
          </p>
        </div>
        <Link
          href="/generate"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0077b5] to-[#0088d4] text-white font-semibold text-sm shadow-xl shadow-[#0077b5]/20 hover:shadow-[#0077b5]/35 transition-all"
        >
          Start generating →
        </Link>
      </div>
    </div>
  )
}
