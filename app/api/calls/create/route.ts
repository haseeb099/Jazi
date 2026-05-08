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
    const {
      agent_id,
      phone_number,
      lead_id,
      direction = 'outbound'
    } = body

    // Create call record
    const { data, error } = await supabase
      .from('calls')
      .insert([{
        agent_id,
        lead_id,
        direction,
        from_number: direction === 'outbound' ? undefined : phone_number,
        to_number: direction === 'outbound' ? phone_number : undefined,
        status: 'queued'
      }])
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, call: data?.[0] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
