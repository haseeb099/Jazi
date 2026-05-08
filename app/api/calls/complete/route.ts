import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

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
    const { call_id, transcript, summary, sentiment_score, sentiment_label } = body

    // Update call with results
    const { error } = await supabase
      .from('calls')
      .update({
        transcript: transcript || [],
        summary,
        sentiment_score,
        sentiment_label,
        status: 'completed',
        ended_at: new Date().toISOString()
      })
      .eq('id', call_id)

    if (error) throw error

    // Cache the result
    await redis.set(`call:${call_id}`, JSON.stringify({ transcript, summary, sentiment_score }), { ex: 86400 })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
