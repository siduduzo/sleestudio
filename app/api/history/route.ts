import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

async function requirePro(userId: string): Promise<boolean> {
  const { data } = await supabase.from('user_plans').select('plan').eq('user_id', userId).maybeSingle()
  return data?.plan === 'pro'
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(await requirePro(userId))) return Response.json({ error: 'Pro feature' }, { status: 403 })

  const { data, error } = await supabase
    .from('post_history')
    .select('id, format, topic, content, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return Response.json({ error: 'Failed to load history' }, { status: 500 })
  return Response.json({ posts: data })
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(await requirePro(userId))) return Response.json({ error: 'Pro feature' }, { status: 403 })

  const { format, topic, content } = await request.json()
  if (!format || !content) return Response.json({ error: 'format and content required' }, { status: 400 })

  const { data, error } = await supabase
    .from('post_history')
    .insert({ user_id: userId, format, topic: topic ?? '', content })
    .select('id, format, topic, content, created_at')
    .single()

  if (error) return Response.json({ error: 'Failed to save post' }, { status: 500 })
  return Response.json({ post: data })
}

export async function DELETE(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json()
  if (!id) return Response.json({ error: 'id required' }, { status: 400 })

  const { error } = await supabase
    .from('post_history')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) return Response.json({ error: 'Failed to delete post' }, { status: 500 })
  return Response.json({ ok: true })
}
