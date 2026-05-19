import { auth } from '@clerk/nextjs/server'
import { supabase, FREE_DAILY_LIMIT } from '@/lib/supabase'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().slice(0, 10)

  const [planResult, usageResult] = await Promise.all([
    supabase.from('user_plans').select('plan').eq('user_id', userId).maybeSingle(),
    supabase.from('daily_usage').select('count').eq('user_id', userId).eq('date', today).maybeSingle(),
  ])

  const plan = planResult.data?.plan ?? 'free'
  const dailyUsage = usageResult.data?.count ?? 0

  return Response.json({
    plan,
    dailyUsage,
    dailyLimit: FREE_DAILY_LIMIT,
    canGenerate: plan === 'pro' || dailyUsage < FREE_DAILY_LIMIT,
  })
}
