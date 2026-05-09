import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { level, level_label, call_id, action_requested, context } = body

    // Create approval request
    const { data, error } = await supabase
      .from('approvals')
      .insert([{
        level,
        level_label,
        call_id,
        action_requested,
        context,
        status: 'pending',
        expires_at: new Date(Date.now() + 5 * 60000).toISOString()
      }])
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, approval: data?.[0] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
