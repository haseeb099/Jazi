# Jazi System Architecture

## Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Components**: Shadcn/UI + custom components
- **Styling**: TailwindCSS v4
- **State Management**: React Hooks + SWR
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend & Infrastructure
- **Backend**: Next.js API Routes (Edge Functions)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: WebSocket (LiveKit)
- **Caching**: Upstash Redis
- **Rate Limiting**: Upstash + custom middleware
- **Storage**: Supabase Storage
- **Deployment**: Vercel

### AI & Voice
- **LLM Provider**: Groq (configurable)
- **Voice Synthesis**: ElevenLabs, Google Cloud, Azure
- **Voice Calls**: Twilio + LiveKit
- **Transcription**: Built-in support for multiple providers

### Integrations
- **CRM**: Built-in (no external dependency)
- **Analytics**: Native Recharts + custom queries
- **Monitoring**: Vercel Analytics + Sentry (optional)
- **Email**: Resend (built-in support)

---

## Data Flow Architecture

### Authentication Flow
```
User → Login Page → Supabase Auth → JWT Token → Middleware
                                                    ↓
                                    Protected Routes (RLS + JWT)
                                                    ↓
                                    Dashboard / App
```

### Call Creation Flow
```
Agent Initiation → API /calls/create → Database Record
                                            ↓
Twilio/LiveKit → Voice Connection → Recording → Processing
                                            ↓
Transcript + Sentiment → Analytics → Dashboard
                                            ↓
HITL System (if needed) → Approvals → Actions
```

### Lead Pipeline Flow
```
Lead Creation → Pipeline Stage Assignment
                            ↓
         ┌────────────────┬─────────────────┬──────────────┐
         ↓                ↓                 ↓              ↓
    New Lead      Contacted            Qualified      Proposal
         ↓                ↓                 ↓              ↓
    Lead Score   BANT Assessment   Agent Assignment  Send Quote
         ↓
   Won/Lost/Stalled
         ↓
   Analytics + Reporting
```

### Real-time Updates
```
Database Change → Supabase Realtime → WebSocket
                                           ↓
                                    Connected Clients
                                           ↓
                                    Update UI State
```

---

## Security Architecture

### Multi-Tenant Isolation

**Row-Level Security (RLS)**
```sql
- All tables have tenant_id
- RLS policies check auth.uid() → user.tenant_id
- Users only see their tenant's data
- Superadmin bypass only in service role
```

**Data Protection**
```
User Request → JWT Verification → Tenant Check (Middleware)
                                           ↓
                                    RLS Query Filter
                                           ↓
                                    Only Tenant Data Returned
```

### Authentication
- **Method**: JWT tokens from Supabase Auth
- **Storage**: Secure HTTP-only cookies
- **Refresh**: Automatic token refresh
- **Scope**: User email, ID, custom metadata

### API Security
- **Rate Limiting**: Upstash (10 req/sec default)
- **Input Validation**: Zod schemas
- **CORS**: Configured for allowed origins
- **CSRF**: SameSite cookies, token validation

### Data Encryption
- **In Transit**: HTTPS/TLS (Vercel automatic)
- **At Rest**: Supabase encryption (default)
- **Sensitive Fields**: Hashed with bcrypt
- **API Keys**: Hashed in database

---

## Scalability Design

### Database Optimization
- **Indexing**: Strategic indexes on:
  - `tenant_id` (all tables)
  - `created_at`, `status` (leads, calls)
  - `user_id` (audit logs)
- **Partitioning**: Calls table partitioned by month
- **Caching**: Redis for frequently accessed data

### API Performance
- **ISR**: Incremental Static Regeneration for dashboards
- **Compression**: Gzip compression enabled
- **Edge Caching**: Vercel edge caching
- **Database Pooling**: Supabase connection pooling

### Real-time Performance
- **WebSocket Optimization**: LiveKit connection pooling
- **Message Queue**: Upstash for async jobs
- **Batch Operations**: Bulk updates supported

### Cost Optimization
```
Supabase: Pay per row + bandwidth
Upstash: Serverless Redis (pay per operation)
Vercel: Serverless functions (pay per invocation)
Twilio: Pay per minute (metered)
Total: Scales with usage, no fixed costs
```

---

## Monitoring & Observability

### Key Metrics
- **Performance**: Page load time, API latency, database query time
- **Reliability**: Error rate, uptime, success rate
- **Usage**: Active users, calls per day, API requests
- **Cost**: Minutes used, database rows, bandwidth

### Logging
```
Error Logs → Sentry (optional)
API Logs → Vercel Logs
Database Logs → Supabase Logs
Auth Logs → Supabase Auth Logs
Business Events → Audit Trail (database)
```

### Alerts
- High error rate (>5%)
- API latency >1000ms
- Database connection errors
- Rate limit threshold exceeded
- Cost threshold exceeded

---

## Deployment Architecture

### Development
```
Local Machine → npm run dev
                      ↓
              Next.js Dev Server (port 3000)
                      ↓
              Hot reload on file changes
```

### Staging
```
Feature Branch → GitHub → Vercel Preview Deployment
                              ↓
                      Automatic preview URLs
                      All integrations connected
                      Same schema as prod
```

### Production
```
main Branch → GitHub → Vercel Production
                            ↓
              Automatic deployment on push
                            ↓
              CI/CD pipeline: Build → Test → Deploy
                            ↓
              CDN distribution via Vercel Edge Network
```

### Environment Management
```
.env.local (development)
.env.production (Vercel)
.env.test (testing)

All fetched from Vercel env panel
Automatically injected at build time
Never committed to git
```

---

## Database Schema Relationships

```
Tenants
  ├── Tenant_Branding (1:1)
  ├── Users (1:N)
  │   ├── Profiles
  │   └── Audit_Logs (creator)
  ├── Agents (1:N)
  │   └── Calls (1:N)
  ├── Leads (1:N)
  │   ├── Calls (1:N)
  │   ├── Tasks (1:N)
  │   └── Pipeline_Stages (1:N)
  ├── Calls (1:N)
  │   ├── Approvals (1:N)
  │   └── Transcripts (embedded)
  ├── Tasks (1:N)
  │   ├── Assigned_To (→ Users)
  │   └── Created_By (→ Users)
  ├── Approvals (1:N)
  │   ├── Resolved_By (→ Users)
  │   └── Call_ID (→ Calls)
  ├── Usage_Metrics (1:N)
  ├── API_Keys (1:N)
  └── Audit_Logs (1:N)
```

---

## Error Handling Strategy

### Client-Side
```typescript
try {
  const response = await fetch('/api/endpoint')
  if (!response.ok) throw new Error(response.statusText)
  return await response.json()
} catch (error) {
  console.error('[v0]', error) // Debug logging
  toast.error('Action failed. Try again.')
  // User feedback via toast notification
}
```

### Server-Side
```typescript
try {
  // Perform operation
} catch (error: any) {
  console.error('Operation failed:', error.message)
  return NextResponse.json(
    { error: error.message },
    { status: 500 }
  )
}
```

### Database
```sql
-- RLS will prevent unauthorized access
-- Triggers handle automation errors gracefully
-- Constraints prevent data integrity issues
```

---

## Caching Strategy

### Redis Cache
- **Sessions**: 24-hour TTL
- **User Data**: 1-hour TTL
- **Call Records**: 7-day TTL
- **Analytics**: 1-hour TTL

### Browser Cache
- **Static Assets**: 365 days
- **API Responses**: 1 minute (via SWR)
- **Images**: 30 days

### Database Query Results
- **Frequently Accessed**: Via Redis
- **Real-time Data**: Direct queries (no cache)
- **Historical Data**: Cache aggressively

---

## Disaster Recovery

### Backup Strategy
- **Database**: Automatic Supabase backups (daily)
- **Point-in-time**: 7-day retention
- **Geographic**: Multi-region replication
- **Manual**: Export on-demand

### Failure Scenarios

**Database Down**
- Read-only mode via cache
- Queue operations for retry
- Notify users of degraded service

**API Down**
- Vercel automatic failover
- Request queuing
- Retry with exponential backoff

**Network Issues**
- Client-side retry logic
- Offline-first data sync
- Service worker for offline support

---

## Performance Benchmarks

### Target Metrics
- **Page Load**: <2 seconds (LCP)
- **Time to Interactive**: <3 seconds
- **Database Query**: <100ms (p95)
- **API Response**: <200ms (p95)
- **Search**: <500ms (p95)

### Optimization Tips
1. Enable Redis caching
2. Use database indexes strategically
3. Implement pagination
4. Compress large responses
5. Lazy load images
6. Use edge functions for geolocation

---

## System Status

### ✅ Production Ready
- All components implemented
- Security hardened
- Scalable architecture
- Monitoring configured
- Documentation complete

### Ready to Deploy
- Clone repository
- Configure environment variables
- Deploy to Vercel
- Configure custom domain
- Enable SSL
- Monitor performance

### Contact & Support
**Issues**: File GitHub issue or contact support
**Deployment**: Use Vercel CLI or GitHub integration
**Monitoring**: Check Vercel Dashboard + custom metrics
