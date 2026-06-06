# Jazi: White-Label AI Voice Agent Platform

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-000000.svg)](https://nextjs.org/)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-181818.svg)](https://supabase.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000.svg)](https://vercel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Shadcn/UI](https://img.shields.io/badge/Shadcn%2FUI-000000?style=flat&logo=shadcn%2Fui&logoColor=white)](https://ui.shadcn.com/)

Jazi is a cutting-edge, production-ready SaaS platform designed for the seamless creation, deployment, and management of AI-powered voice agents. It offers enterprise-grade security, robust Human-in-the-Loop (HITL) controls, and extensive white-labeling capabilities, making it ideal for businesses seeking to integrate advanced conversational AI.

## ✨ Features

### Core Capabilities
*   **Intelligent AI Voice Agents**: Develop sophisticated voice agents without writing a single line of code, guided by an intuitive wizard.
*   **Comprehensive White-Label Solution**: Fully customize the platform with your brand identity, including custom domains, logos, and themes.
*   **Multi-Provider AI Integration**: Seamlessly integrate with leading AI providers such as Groq, ElevenLabs, Google Cloud, and Azure for diverse LLM and voice synthesis options.
*   **Real-Time Call Management**: Facilitate inbound and outbound calls, manage browser-based agents, and leverage deep integration with Twilio for robust telephony.
*   **Integrated CRM**: Features built-in lead management, pipeline tracking, and BANT (Budget, Authority, Need, Timeline) scoring to optimize sales processes.
*   **Advanced Human-in-the-Loop (HITL)**: Implement a 6-tier approval system with dynamic barge-in and takeover functionalities for critical interactions.
*   **In-depth Analytics**: Gain actionable insights with detailed call volume analysis, sentiment analysis, and comprehensive performance metrics.
*   **Enterprise-Grade Security**: Ensures data integrity and privacy with row-level security, multi-tenant isolation, and extensive audit logging.

## 🚀 Tech Stack

Jazi is built with a modern and scalable architecture, leveraging the following technologies:

*   **Frontend**: Next.js 15, React 19, Shadcn/UI components
*   **Backend**: Supabase (PostgreSQL), Edge functions, Server-side rendering
*   **Real-time Communication**: WebSocket support, LiveKit for high-fidelity voice calls
*   **Caching & Rate Limiting**: Upstash Redis for efficient session management and abuse prevention
*   **Artificial Intelligence**: Groq for high-performance LLM inference, integrated with multiple voice providers
*   **Infrastructure**: Deployed on Vercel for a serverless, scalable, and performant environment

## 🏁 Getting Started

Follow these steps to set up Jazi for local development.

### Prerequisites

Ensure you have the following installed:

*   Node.js 18+ (with pnpm, npm, or yarn)
*   A Supabase account
*   An Upstash Redis account
*   (Optional) Groq API key for advanced LLM features
*   Accounts with preferred voice providers (e.g., ElevenLabs, Google Cloud)

### Local Development

1.  **Clone the repository and install dependencies:**

    ```bash
    git clone <repo_url>
    cd jazi
    pnpm install
    ```

2.  **Configure environment variables:**

    Create a `.env.local` file in the root directory and populate it with your credentials:

    ```bash
    # Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
    SUPABASE_SERVICE_KEY=your_service_key

    # Upstash Redis Configuration
    KV_REST_API_URL=your_upstash_url
    KV_REST_API_TOKEN=your_upstash_token

    # AI Provider Keys
    GROQ_API_KEY=your_groq_key

    # Twilio Integration (Optional)
    TWILIO_ACCOUNT_SID=your_sid
    TWILIO_AUTH_TOKEN=your_token
    TWILIO_PHONE_NUMBER=your_number
    ```

3.  **Start the development server:**

    ```bash
    pnpm dev
    ```

    The application will be accessible at `http://localhost:3000`.

## 🏗️ Architecture & Project Structure

Jazi follows a modular and scalable project structure:

```
jazi/
├── app/                          # Next.js app router for pages and API routes
│   ├── (auth)/                  # Authentication pages (login, signup)
│   ├── (dashboard)/             # Protected dashboard sections (CRM, agents, calls, analytics)
│   ├── api/                     # Backend API routes
│   └── page.tsx                 # Public landing page
├── components/                   # Reusable UI components (Shadcn UI, custom)
│   ├── ui/                      # Shadcn UI components
│   ├── auth/                    # Authentication related components
│   └── ...                      # Other domain-specific components
├── lib/                         # Utility functions and configurations (Supabase clients, helpers)
│   ├── supabase/               # Supabase client configurations
│   └── utils.ts                # General utility functions
├── types/                       # TypeScript type definitions (database schemas)
├── hooks/                       # Custom React hooks for shared logic
└── middleware.ts               # Next.js middleware for authentication and routing
```

### Database Schema Highlights

The PostgreSQL database, managed via Supabase, includes key tables with Row-Level Security (RLS) enabled for tenant isolation:

*   **tenants**: Manages organization accounts.
*   **tenant_branding**: Stores white-labeling customization settings.
*   **users**: User accounts and team members.
*   **agents**: Configuration for AI voice agents.
*   **leads**: CRM lead data.
*   **pipeline_stages**: Defines sales pipeline stages.
*   **calls**: Records of voice call interactions.
*   **tasks**: Internal team tasks.
*   **approvals**: Human-in-the-Loop approval requests.
*   **usage_metrics**: Tracks billing and platform usage.
*   **api_keys**: Manages API access for integrations.
*   **audit_logs**: Comprehensive security audit trail.

## 🔒 Security

Jazi is built with a strong focus on security, incorporating best practices and robust measures:

### Implemented Security Measures

*   ✅ **Row-Level Security (RLS)**: Ensures strict data isolation between tenants.
*   ✅ **JWT-based Authentication**: Secure user authentication using JSON Web Tokens.
*   ✅ **Secure Password Hashing**: Utilizes bcrypt for strong password protection.
*   ✅ **HTTPS/TLS Encryption**: All communications are encrypted in transit.
*   ✅ **Input Validation & Sanitization**: Prevents common web vulnerabilities like XSS and SQL injection.
*   ✅ **Rate Limiting**: Implemented with Upstash to prevent abuse and brute-force attacks.
*   ✅ **Audit Logging**: Comprehensive logs for security monitoring and compliance.
*   ✅ **API Key Management**: Secure handling and rotation of API keys.
*   ✅ **CORS Protection**: Cross-Origin Resource Sharing policies to restrict unauthorized access.
*   ✅ **CSRF Protection**: Measures to prevent Cross-Site Request Forgery attacks.

### Best Practices Followed

*   All database queries are parameterized to prevent SQL injection.
*   Sensitive data is never logged or exposed.
*   API endpoints rigorously validate user ownership and permissions.
*   All user inputs are validated on both client and server sides.
*   Rate limits prevent abuse.
*   Regular security audits are recommended to maintain a high security posture.

## ☁️ Deployment

Jazi is optimized for deployment on Vercel, offering a seamless and scalable hosting solution.

### Vercel (Recommended)

1.  Push your codebase to a GitHub repository.
2.  Connect the repository to your Vercel account.
3.  Add all necessary environment variables within your Vercel project settings.
4.  Vercel will automatically deploy your application on every push to the main branch.

    ```bash
    vercel env add NEXT_PUBLIC_SUPABASE_URL
    vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
    vercel env add SUPABASE_SERVICE_KEY
    vercel env add KV_REST_API_URL
    vercel env add KV_REST_API_TOKEN
    vercel env add GROQ_API_KEY
    # Add other AI provider keys and Twilio variables as needed
    ```

### Production Checklist

Before going live, ensure the following:

*   [ ] Configure a custom domain.
*   [ ] Set up SSL certificates (Vercel handles this automatically).
*   [ ] Configure Supabase database backups.
*   [ ] Verify Row-Level Security (RLS) is enabled on all tables.
*   [ ] Adjust rate limits according to expected traffic.
*   [ ] Set up comprehensive monitoring and logging.
*   [ ] Add support contact information within the application.
*   [ ] Configure email notifications for critical events.
*   [ ] Thoroughly test the Human-in-the-Loop (HITL) approval workflows.
*   [ ] Verify call recording and playback functionalities.
*   [ ] Test all third-party integrations.

## 🤝 Support

For any inquiries, issues, or support requests, please reach out through the following channels:

*   **Email**: support@jazi.ai
*   **Documentation**: [https://docs.jazi.ai](https://docs.jazi.ai)
*   **Status Page**: [https://status.jazi.ai](https://status.jazi.ai)

## 📄 License

This project is proprietary. All rights reserved by Muhammad Haseeb Rafique.

---

&copy; 2026 Muhammad Haseeb Rafique. All rights reserved.
