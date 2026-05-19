import { auth } from '@clerk/nextjs/server'
import { supabase, FREE_DAILY_LIMIT } from '@/lib/supabase'

// Called once before each "Generate All" or "Regenerate" session.
// Atomically checks and increments daily usage for free users.
export async function POST() {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: planData } = await supabase
    .from('user_plans')
    .select('plan')
    .eq('user_id', userId)
    .maybeSingle()

  if (planData?.plan === 'pro') {
    return Response.json({ allowed: true, plan: 'pro' })
  }

  const today = new Date().toISOString().slice(0, 10)

  const { data: usage } = await supabase
    .from('daily_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle()

  const currentCount = usage?.count ?? 0

  if (currentCount >= FREE_DAILY_LIMIT) {
    return Response.json(
      { error: 'Daily limit reached. Upgrade to Pro for unlimited generations.' },
      { status: 429 }
    )
  }

  await supabase.from('daily_usage').upsert(
    { user_id: userId, date: today, count: currentCount + 1 },
    { onConflict: 'user_id,date' }
  )

  return Response.json({
    allowed: true,
    plan: 'free',
    dailyUsage: currentCount + 1,
    dailyLimit: FREE_DAILY_LIMIT,
    remaining: FREE_DAILY_LIMIT - currentCount - 1,
  })
}
