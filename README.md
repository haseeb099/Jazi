# Jazi - White-Label AI Voice Agent Platform

A complete production-ready SaaS platform for building, deploying, and managing AI-powered voice agents with enterprise-grade security, HITL controls, and white-labeling capabilities.

## Features

### Core Capabilities
- **AI Voice Agents**: Build intelligent voice agents without coding using our wizard
- **White-Label Solution**: Complete customization with your branding, domains, logos
- **Multi-Provider Support**: Works with Groq, ElevenLabs, Google Cloud, Azure, and more
- **Real-Time Call Management**: Inbound/outbound calls, browser-based agents, Twilio integration
- **CRM Integration**: Built-in lead management, pipeline tracking, BANT scoring
- **Human-in-the-Loop**: 6-tier approval system with barge-in and takeover capabilities
- **Advanced Analytics**: Call volume, sentiment analysis, performance metrics
- **Enterprise Security**: Row-level security, multi-tenant isolation, audit logging

### Architecture
- **Frontend**: Next.js 15, React 19, Shadcn/UI components
- **Backend**: Supabase (PostgreSQL), Edge functions, Server-side rendering
- **Real-time**: WebSocket support, LiveKit for voice calls
- **Caching**: Upstash Redis for rate limiting and session management
- **AI**: Groq for LLM inference, multiple voice providers
- **Infrastructure**: Vercel deployment, serverless architecture

## Getting Started

### Prerequisites
- Node.js 18+ (pnpm, npm, or yarn)
- Supabase account
- Upstash Redis account
- Groq API key (optional, for LLM features)
- Voice provider accounts (ElevenLabs, Google Cloud, etc.)

### Local Development

1. **Clone and install**
```bash
git clone <repo>
cd jazi
pnpm install
```

2. **Environment variables** (`.env.local`)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_KEY=your_service_key

# Upstash Redis
KV_REST_API_URL=your_upstash_url
KV_REST_API_TOKEN=your_upstash_token

# AI Providers
GROQ_API_KEY=your_groq_key

# Twilio (optional)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_number
```

3. **Start development server**
```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
jazi/
├── app/                          # Next.js app router
│   ├── (auth)/                  # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/             # Protected dashboard
│   │   ├── dashboard/           # Main dashboard
│   │   ├── crm/leads/           # Lead management
│   │   ├── agents/              # Agent management
│   │   ├── calls/               # Call history
│   │   ├── approvals/           # HITL approvals
│   │   ├── analytics/           # Analytics
│   │   └── settings/            # Settings
│   ├── api/                     # API routes
│   │   ├── leads/
│   │   ├── calls/
│   │   └── approvals/
│   └── page.tsx                 # Landing page
├── components/                   # Reusable components
│   ├── ui/                      # Shadcn UI components
│   ├── auth/                    # Auth forms
│   ├── crm/                     # CRM components
│   ├── agents/                  # Agent components
│   ├── calls/                   # Call components
│   ├── dashboard/               # Dashboard components
│   ├── approvals/               # Approval components
│   ├── analytics/               # Analytics components
│   └── layout/                  # Layout components
├── lib/                         # Utilities
│   ├── supabase/               # Supabase clients
│   ├── utils.ts                # Helper functions
│   └── rate-limit.ts           # Rate limiting
├── types/                       # TypeScript types
│   └── database.ts             # Database types
├── hooks/                       # Custom hooks
│   ├── use-user.ts
│   └── use-tenant.ts
└── middleware.ts               # Auth middleware
```

## Database Schema

### Core Tables
- **tenants**: Organization accounts
- **tenant_branding**: Customization settings
- **users**: Team members
- **agents**: AI voice agents
- **leads**: CRM leads
- **pipeline_stages**: Sales pipeline stages
- **calls**: Voice call records
- **tasks**: Team tasks
- **approvals**: HITL approval requests
- **usage_metrics**: Billing/usage tracking
- **api_keys**: API access management
- **audit_logs**: Security audit trail

All tables have Row-Level Security (RLS) enabled with tenant isolation.

## Key Pages

### Authenticated Pages
- `/dashboard` - Main dashboard with metrics and recent activity
- `/crm/leads` - Lead management with table and pipeline views
- `/agents` - Agent creation and management
- `/calls` - Call history and analytics
- `/approvals` - Human-in-the-loop approval requests
- `/analytics` - Call volume, sentiment, and performance analytics
- `/settings` - Account, branding, API, and team settings

### Public Pages
- `/` - Landing page
- `/auth/login` - Login
- `/auth/signup` - Sign up
- `/onboarding` - Onboarding wizard for new accounts

## API Routes

### Leads
- `POST /api/leads/bulk-update` - Bulk update lead status

### Calls
- `POST /api/calls/create` - Create new call
- `POST /api/calls/complete` - Complete call with transcript/summary

### Approvals
- `POST /api/approvals/create` - Create approval request

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy automatically on push

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_KEY
vercel env add KV_REST_API_URL
vercel env add KV_REST_API_TOKEN
vercel env add GROQ_API_KEY
```

### Production Checklist

- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Configure Supabase backup
- [ ] Enable RLS on all tables (already done)
- [ ] Set rate limits appropriately
- [ ] Configure monitoring/logging
- [ ] Add support contact info
- [ ] Set up email notifications
- [ ] Test HITL approval flow
- [ ] Verify call recording/playback
- [ ] Test all integrations

## Security

### Implemented
- ✅ Row-level security (RLS) for data isolation
- ✅ JWT-based authentication
- ✅ Secure password hashing (bcrypt)
- ✅ HTTPS/TLS encryption
- ✅ Input validation and sanitization
- ✅ Rate limiting (Upstash)
- ✅ Audit logging
- ✅ API key management
- ✅ CORS protection
- ✅ CSRF protection

### Best Practices
- All database queries use parameterized queries
- Sensitive data is never logged
- API endpoints validate user ownership
- All user inputs are validated on server
- Rate limits prevent abuse
- Regular security audits recommended

## Support

For issues and questions:
- Email: support@jazi.ai
- Documentation: https://docs.jazi.ai
- Status: https://status.jazi.ai

## License

Proprietary - All rights reserved
