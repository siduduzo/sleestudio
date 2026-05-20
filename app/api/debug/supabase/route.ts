import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { userId } = await auth()

  const [usageResult, planResult, myPlanResult] = await Promise.all([
    supabase.from('daily_usage').select('*').order('date', { ascending: false }).limit(20),
    supabase.from('user_plans').select('*').limit(20),
    userId
      ? supabase.from('user_plans').select('*').eq('user_id', userId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ])

  return Response.json({
    supabase_url: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.slice(0, 40) + '...' : '(not set)',
    key_prefix: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? process.env.SUPABASE_SERVICE_ROLE_KEY.slice(0, 20) + '...'
      : '(not set)',
    authenticated_user_id: userId ?? null,
    my_plan_row: myPlanResult.data ?? null,
    my_plan_error: myPlanResult.error?.message ?? null,
    all_user_plans: planResult.data ?? [],
    user_plans_error: planResult.error?.message ?? null,
    daily_usage_rows: usageResult.data ?? [],
    daily_usage_error: usageResult.error?.message ?? null,
  })
}
