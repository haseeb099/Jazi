import { streamText, convertToModelMessages, tool } from 'ai'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Define tools for the AI agent
const agentTools = {
  createLead: tool({
    description: 'Create a new lead in the CRM system with the provided information',
    inputSchema: z.object({
      firstName: z.string().describe('First name of the lead'),
      lastName: z.string().nullable().describe('Last name of the lead'),
      email: z.string().email().nullable().describe('Email address'),
      phone: z.string().nullable().describe('Phone number'),
      company: z.string().nullable().describe('Company name'),
      notes: z.string().nullable().describe('Additional notes about the lead'),
      leadScore: z.number().min(0).max(100).default(50).describe('Initial lead score'),
    }),
    execute: async ({ firstName, lastName, email, phone, company, notes, leadScore }) => {
      const supabase = await createClient()
      const { data: user } = await supabase.auth.getUser()
      
      if (!user.user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { data: userData } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.user.id)
        .single()

      if (!userData?.tenant_id) {
        return { success: false, error: 'No tenant found' }
      }

      const { data: lead, error } = await supabase
        .from('leads')
        .insert({
          tenant_id: userData.tenant_id,
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          company,
          notes,
          lead_score: leadScore,
          status: 'new',
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { 
        success: true, 
        lead: {
          id: lead.id,
          name: `${firstName} ${lastName || ''}`.trim(),
          email,
          phone,
        },
        message: `Lead created successfully for ${firstName}`
      }
    },
  }),

  lookupCustomer: tool({
    description: 'Look up a customer by phone number or email in the CRM',
    inputSchema: z.object({
      phone: z.string().nullable().describe('Phone number to search'),
      email: z.string().email().nullable().describe('Email to search'),
    }),
    execute: async ({ phone, email }) => {
      const supabase = await createClient()
      const { data: user } = await supabase.auth.getUser()
      
      if (!user.user) {
        return { found: false, error: 'Not authenticated' }
      }

      const { data: userData } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.user.id)
        .single()

      if (!userData?.tenant_id) {
        return { found: false, error: 'No tenant found' }
      }

      let query = supabase
        .from('leads')
        .select('*')
        .eq('tenant_id', userData.tenant_id)

      if (phone) {
        query = query.eq('phone', phone)
      } else if (email) {
        query = query.eq('email', email)
      } else {
        return { found: false, error: 'Please provide phone or email' }
      }

      const { data: leads } = await query

      if (!leads || leads.length === 0) {
        return { found: false, message: 'No customer found with that information' }
      }

      const lead = leads[0]
      return {
        found: true,
        customer: {
          id: lead.id,
          name: `${lead.first_name || ''} ${lead.last_name || ''}`.trim(),
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          status: lead.status,
          leadScore: lead.lead_score,
        },
      }
    },
  }),

  updateLeadScore: tool({
    description: 'Update the BANT scores for a lead',
    inputSchema: z.object({
      leadId: z.string().uuid().describe('The lead ID to update'),
      budget: z.number().min(0).max(25).nullable().describe('Budget score 0-25'),
      authority: z.number().min(0).max(25).nullable().describe('Authority score 0-25'),
      need: z.number().min(0).max(25).nullable().describe('Need score 0-25'),
      timeline: z.number().min(0).max(25).nullable().describe('Timeline score 0-25'),
    }),
    execute: async ({ leadId, budget, authority, need, timeline }) => {
      const supabase = await createClient()
      
      const updates: Record<string, number> = {}
      if (budget !== null) updates.bant_budget = budget
      if (authority !== null) updates.bant_authority = authority
      if (need !== null) updates.bant_need = need
      if (timeline !== null) updates.bant_timeline = timeline
      
      // Calculate total lead score
      const { data: lead } = await supabase
        .from('leads')
        .select('bant_budget, bant_authority, bant_need, bant_timeline')
        .eq('id', leadId)
        .single()

      if (lead) {
        const totalScore = 
          (budget ?? lead.bant_budget) + 
          (authority ?? lead.bant_authority) + 
          (need ?? lead.bant_need) + 
          (timeline ?? lead.bant_timeline)
        updates.lead_score = totalScore
      }

      const { error } = await supabase
        .from('leads')
        .update(updates)
        .eq('id', leadId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, message: 'Lead scores updated' }
    },
  }),

  createTask: tool({
    description: 'Create a follow-up task for a team member',
    inputSchema: z.object({
      title: z.string().describe('Task title'),
      description: z.string().nullable().describe('Task description'),
      leadId: z.string().uuid().nullable().describe('Related lead ID'),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
      dueAt: z.string().nullable().describe('Due date in ISO format'),
    }),
    execute: async ({ title, description, leadId, priority, dueAt }) => {
      const supabase = await createClient()
      const { data: user } = await supabase.auth.getUser()
      
      if (!user.user) {
        return { success: false, error: 'Not authenticated' }
      }

      const { data: userData } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.user.id)
        .single()

      if (!userData?.tenant_id) {
        return { success: false, error: 'No tenant found' }
      }

      const { data: task, error } = await supabase
        .from('tasks')
        .insert({
          tenant_id: userData.tenant_id,
          title,
          description,
          lead_id: leadId,
          priority,
          due_at: dueAt,
          created_by: user.user.id,
          status: 'pending',
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, taskId: task.id, message: `Task "${title}" created` }
    },
  }),

  getBusinessInfo: tool({
    description: 'Get business information like hours, services, contact info',
    inputSchema: z.object({
      infoType: z.enum(['hours', 'services', 'contact', 'about']).describe('Type of info requested'),
    }),
    execute: async ({ infoType }) => {
      const supabase = await createClient()
      const { data: user } = await supabase.auth.getUser()
      
      if (!user.user) {
        return { error: 'Not authenticated' }
      }

      const { data: userData } = await supabase
        .from('users')
        .select('tenant_id')
        .eq('id', user.user.id)
        .single()

      if (!userData?.tenant_id) {
        return { error: 'No tenant found' }
      }

      const { data: tenant } = await supabase
        .from('tenants')
        .select('*, tenant_branding(*)')
        .eq('id', userData.tenant_id)
        .single()

      // Return relevant business info based on type
      switch (infoType) {
        case 'hours':
          return {
            hours: 'Monday - Friday: 9:00 AM - 5:00 PM\nSaturday: 10:00 AM - 2:00 PM\nSunday: Closed',
            timezone: 'America/New_York',
          }
        case 'contact':
          return {
            name: tenant?.name || 'Our Company',
            email: 'contact@example.com',
            phone: '(555) 123-4567',
          }
        case 'services':
          return {
            services: [
              'AI Voice Agents',
              'Lead Qualification',
              'Appointment Scheduling',
              'Customer Support',
              'Sales Automation',
            ],
          }
        case 'about':
          return {
            about: `${tenant?.name || 'We'} provide AI-powered voice solutions to help businesses automate their phone communications.`,
          }
        default:
          return { error: 'Unknown info type' }
      }
    },
  }),
}

export async function POST(req: Request) {
  try {
    const { messages, agentId, systemPrompt } = await req.json()

    // Get the agent's system prompt if agentId is provided
    let finalSystemPrompt = systemPrompt || 'You are a helpful AI assistant.'

    if (agentId) {
      const supabase = await createClient()
      const { data: agent } = await supabase
        .from('agents')
        .select('system_prompt, name')
        .eq('id', agentId)
        .single()

      if (agent?.system_prompt) {
        finalSystemPrompt = agent.system_prompt
      }
    }

    const result = streamText({
      model: 'groq/llama-3.3-70b-versatile',
      system: finalSystemPrompt,
      messages: await convertToModelMessages(messages),
      tools: agentTools,
      maxSteps: 5,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('AI Chat Error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
