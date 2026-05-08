export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string
          name: string
          slug: string
          custom_domain: string | null
          plan: "starter" | "pro" | "enterprise" | "free"
          plan_minutes_included: number
          status: "active" | "suspended" | "cancelled" | "trial"
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          stripe_connect_account_id: string | null
          phone_mode: "personal" | "trial" | "browser"
          verified_phone_number: string | null
          twilio_trial_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          custom_domain?: string | null
          plan?: "starter" | "pro" | "enterprise" | "free"
          plan_minutes_included?: number
          status?: "active" | "suspended" | "cancelled" | "trial"
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_connect_account_id?: string | null
          phone_mode?: "personal" | "trial" | "browser"
          verified_phone_number?: string | null
          twilio_trial_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          custom_domain?: string | null
          plan?: "starter" | "pro" | "enterprise" | "free"
          plan_minutes_included?: number
          status?: "active" | "suspended" | "cancelled" | "trial"
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_connect_account_id?: string | null
          phone_mode?: "personal" | "trial" | "browser"
          verified_phone_number?: string | null
          twilio_trial_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tenant_branding: {
        Row: {
          tenant_id: string
          primary_color: string
          secondary_color: string
          logo_url: string | null
          favicon_url: string | null
          company_name: string | null
          custom_css: string | null
          updated_at: string
        }
        Insert: {
          tenant_id: string
          primary_color?: string
          secondary_color?: string
          logo_url?: string | null
          favicon_url?: string | null
          company_name?: string | null
          custom_css?: string | null
          updated_at?: string
        }
        Update: {
          tenant_id?: string
          primary_color?: string
          secondary_color?: string
          logo_url?: string | null
          favicon_url?: string | null
          company_name?: string | null
          custom_css?: string | null
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          tenant_id: string | null
          email: string
          full_name: string | null
          avatar_url: string | null
          role: "owner" | "admin" | "member" | "viewer"
          is_onboarded: boolean
          created_at: string
        }
        Insert: {
          id: string
          tenant_id?: string | null
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "owner" | "admin" | "member" | "viewer"
          is_onboarded?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string | null
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "owner" | "admin" | "member" | "viewer"
          is_onboarded?: boolean
          created_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          tenant_id: string
          name: string
          description: string | null
          status: "active" | "draft" | "archived"
          system_prompt: string
          voice_provider: string
          voice_id: string | null
          voice_speed: number
          language: string
          timezone: string
          business_hours: Json
          tools_enabled: string[]
          after_hours_message: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          description?: string | null
          status?: "active" | "draft" | "archived"
          system_prompt?: string
          voice_provider?: string
          voice_id?: string | null
          voice_speed?: number
          language?: string
          timezone?: string
          business_hours?: Json
          tools_enabled?: string[]
          after_hours_message?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          description?: string | null
          status?: "active" | "draft" | "archived"
          system_prompt?: string
          voice_provider?: string
          voice_id?: string | null
          voice_speed?: number
          language?: string
          timezone?: string
          business_hours?: Json
          tools_enabled?: string[]
          after_hours_message?: string
          created_at?: string
          updated_at?: string
        }
      }
      pipeline_stages: {
        Row: {
          id: string
          tenant_id: string
          name: string
          position: number
          probability: number
          color: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          position: number
          probability?: number
          color?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          position?: number
          probability?: number
          color?: string
        }
      }
      leads: {
        Row: {
          id: string
          tenant_id: string
          first_name: string | null
          last_name: string | null
          email: string | null
          phone: string | null
          company: string | null
          website: string | null
          lead_score: number
          bant_budget: number
          bant_authority: number
          bant_need: number
          bant_timeline: number
          status:
            | "new"
            | "contacted"
            | "qualified"
            | "proposal"
            | "negotiation"
            | "won"
            | "lost"
          pipeline_stage_id: string | null
          assigned_agent_id: string | null
          tags: string[]
          notes: string | null
          enrichment_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          company?: string | null
          website?: string | null
          lead_score?: number
          bant_budget?: number
          bant_authority?: number
          bant_need?: number
          bant_timeline?: number
          status?:
            | "new"
            | "contacted"
            | "qualified"
            | "proposal"
            | "negotiation"
            | "won"
            | "lost"
          pipeline_stage_id?: string | null
          assigned_agent_id?: string | null
          tags?: string[]
          notes?: string | null
          enrichment_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          company?: string | null
          website?: string | null
          lead_score?: number
          bant_budget?: number
          bant_authority?: number
          bant_need?: number
          bant_timeline?: number
          status?:
            | "new"
            | "contacted"
            | "qualified"
            | "proposal"
            | "negotiation"
            | "won"
            | "lost"
          pipeline_stage_id?: string | null
          assigned_agent_id?: string | null
          tags?: string[]
          notes?: string | null
          enrichment_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      calls: {
        Row: {
          id: string
          tenant_id: string
          agent_id: string | null
          lead_id: string | null
          direction: "inbound" | "outbound" | "browser"
          status:
            | "queued"
            | "ringing"
            | "in-progress"
            | "completed"
            | "failed"
            | "busy"
            | "no-answer"
            | "cancelled"
          phone_mode: "personal" | "trial" | "browser" | null
          from_number: string | null
          to_number: string | null
          duration_seconds: number
          recording_url: string | null
          transcript: Json
          summary: string | null
          action_items: Json
          sentiment_score: number | null
          sentiment_label: "positive" | "neutral" | "negative" | null
          twilio_call_sid: string | null
          livekit_room_name: string | null
          cost_cents: number
          started_at: string | null
          ended_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          agent_id?: string | null
          lead_id?: string | null
          direction?: "inbound" | "outbound" | "browser"
          status?:
            | "queued"
            | "ringing"
            | "in-progress"
            | "completed"
            | "failed"
            | "busy"
            | "no-answer"
            | "cancelled"
          phone_mode?: "personal" | "trial" | "browser" | null
          from_number?: string | null
          to_number?: string | null
          duration_seconds?: number
          recording_url?: string | null
          transcript?: Json
          summary?: string | null
          action_items?: Json
          sentiment_score?: number | null
          sentiment_label?: "positive" | "neutral" | "negative" | null
          twilio_call_sid?: string | null
          livekit_room_name?: string | null
          cost_cents?: number
          started_at?: string | null
          ended_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          agent_id?: string | null
          lead_id?: string | null
          direction?: "inbound" | "outbound" | "browser"
          status?:
            | "queued"
            | "ringing"
            | "in-progress"
            | "completed"
            | "failed"
            | "busy"
            | "no-answer"
            | "cancelled"
          phone_mode?: "personal" | "trial" | "browser" | null
          from_number?: string | null
          to_number?: string | null
          duration_seconds?: number
          recording_url?: string | null
          transcript?: Json
          summary?: string | null
          action_items?: Json
          sentiment_score?: number | null
          sentiment_label?: "positive" | "neutral" | "negative" | null
          twilio_call_sid?: string | null
          livekit_room_name?: string | null
          cost_cents?: number
          started_at?: string | null
          ended_at?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          tenant_id: string
          lead_id: string | null
          call_id: string | null
          title: string
          description: string | null
          due_at: string | null
          priority: "low" | "medium" | "high" | "urgent"
          status: "pending" | "in-progress" | "completed" | "cancelled"
          assigned_to: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          lead_id?: string | null
          call_id?: string | null
          title: string
          description?: string | null
          due_at?: string | null
          priority?: "low" | "medium" | "high" | "urgent"
          status?: "pending" | "in-progress" | "completed" | "cancelled"
          assigned_to?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          lead_id?: string | null
          call_id?: string | null
          title?: string
          description?: string | null
          due_at?: string | null
          priority?: "low" | "medium" | "high" | "urgent"
          status?: "pending" | "in-progress" | "completed" | "cancelled"
          assigned_to?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      approvals: {
        Row: {
          id: string
          tenant_id: string
          call_id: string | null
          level: number
          level_label:
            | "CRITICAL"
            | "WARNING"
            | "INFO"
            | "CHAT"
            | "BARGE"
            | "TAKEOVER"
          action_requested: string
          context: Json
          status:
            | "pending"
            | "approved"
            | "rejected"
            | "expired"
            | "auto-approved"
          expires_at: string
          requested_at: string
          resolved_at: string | null
          resolved_by: string | null
          resolution_note: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          call_id?: string | null
          level: number
          level_label:
            | "CRITICAL"
            | "WARNING"
            | "INFO"
            | "CHAT"
            | "BARGE"
            | "TAKEOVER"
          action_requested: string
          context?: Json
          status?:
            | "pending"
            | "approved"
            | "rejected"
            | "expired"
            | "auto-approved"
          expires_at?: string
          requested_at?: string
          resolved_at?: string | null
          resolved_by?: string | null
          resolution_note?: string | null
        }
        Update: {
          id?: string
          tenant_id?: string
          call_id?: string | null
          level?: number
          level_label?:
            | "CRITICAL"
            | "WARNING"
            | "INFO"
            | "CHAT"
            | "BARGE"
            | "TAKEOVER"
          action_requested?: string
          context?: Json
          status?:
            | "pending"
            | "approved"
            | "rejected"
            | "expired"
            | "auto-approved"
          expires_at?: string
          requested_at?: string
          resolved_at?: string | null
          resolved_by?: string | null
          resolution_note?: string | null
        }
      }
      usage_metrics: {
        Row: {
          id: string
          tenant_id: string
          call_id: string | null
          minutes_used: number
          cost_cents: number
          period_month: string
          recorded_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          call_id?: string | null
          minutes_used: number
          cost_cents?: number
          period_month: string
          recorded_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          call_id?: string | null
          minutes_used?: number
          cost_cents?: number
          period_month?: string
          recorded_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          tenant_id: string
          name: string
          key_hash: string
          key_prefix: string
          scopes: string[]
          last_used_at: string | null
          expires_at: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          key_hash: string
          key_prefix: string
          scopes?: string[]
          last_used_at?: string | null
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          key_hash?: string
          key_prefix?: string
          scopes?: string[]
          last_used_at?: string | null
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          tenant_id: string | null
          user_id: string | null
          action: string
          resource: string
          resource_id: string | null
          metadata: Json
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          user_id?: string | null
          action: string
          resource: string
          resource_id?: string | null
          metadata?: Json
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string | null
          user_id?: string | null
          action?: string
          resource?: string
          resource_id?: string | null
          metadata?: Json
          ip_address?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type Tenant = Database["public"]["Tables"]["tenants"]["Row"]
export type TenantBranding =
  Database["public"]["Tables"]["tenant_branding"]["Row"]
export type User = Database["public"]["Tables"]["users"]["Row"]
export type Agent = Database["public"]["Tables"]["agents"]["Row"]
export type PipelineStage =
  Database["public"]["Tables"]["pipeline_stages"]["Row"]
export type Lead = Database["public"]["Tables"]["leads"]["Row"]
export type Call = Database["public"]["Tables"]["calls"]["Row"]
export type Task = Database["public"]["Tables"]["tasks"]["Row"]
export type Approval = Database["public"]["Tables"]["approvals"]["Row"]
export type UsageMetric = Database["public"]["Tables"]["usage_metrics"]["Row"]
export type ApiKey = Database["public"]["Tables"]["api_keys"]["Row"]
export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"]
