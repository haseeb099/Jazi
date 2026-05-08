"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import {
  Loader2,
  Building2,
  Phone,
  Bot,
  ChevronRight,
  ChevronLeft,
  Globe,
  Smartphone,
  Monitor,
} from "lucide-react"
import { generateSlug } from "@/lib/utils"

interface OnboardingWizardProps {
  userEmail: string
  userId: string
}

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
]

const PHONE_MODES = [
  {
    id: "browser",
    name: "Browser Demo",
    description: "Test calls in your browser. No phone setup needed.",
    icon: Monitor,
  },
  {
    id: "personal",
    name: "Personal Number",
    description: "Use your own phone number with Twilio verification.",
    icon: Smartphone,
  },
  {
    id: "trial",
    name: "Twilio Trial",
    description: "Use your free Twilio trial number automatically.",
    icon: Phone,
  },
]

const AGENT_TEMPLATES = [
  {
    id: "sales",
    name: "Sales Qualifier",
    prompt:
      "You are a friendly sales assistant. Your goal is to understand the customer's needs, qualify them using BANT criteria, and schedule follow-up calls with the sales team.",
  },
  {
    id: "support",
    name: "Customer Support",
    prompt:
      "You are a helpful customer support agent. Your goal is to assist customers with their questions, troubleshoot issues, and escalate complex problems to human agents when needed.",
  },
  {
    id: "appointment",
    name: "Appointment Scheduler",
    prompt:
      "You are a professional appointment scheduler. Your goal is to help customers book appointments, provide available time slots, and confirm booking details.",
  },
  {
    id: "custom",
    name: "Custom Agent",
    prompt: "You are a helpful AI assistant.",
  },
]

export function OnboardingWizard({ userEmail, userId }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Step 1: Workspace
  const [companyName, setCompanyName] = useState("")
  const [slug, setSlug] = useState("")
  const [timezone, setTimezone] = useState("America/New_York")

  // Step 2: Phone
  const [phoneMode, setPhoneMode] = useState("browser")

  // Step 3: Agent
  const [agentName, setAgentName] = useState("My First Agent")
  const [selectedTemplate, setSelectedTemplate] = useState("sales")

  const handleCompanyNameChange = (value: string) => {
    setCompanyName(value)
    setSlug(generateSlug(value))
  }

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      // Create tenant
      const { data: tenant, error: tenantError } = await supabase
        .from("tenants")
        .insert({
          name: companyName,
          slug,
          phone_mode: phoneMode,
        })
        .select()
        .single()

      if (tenantError) throw tenantError

      // Update user with tenant_id
      const { error: userError } = await supabase
        .from("users")
        .update({
          tenant_id: tenant.id,
          is_onboarded: true,
          role: "owner",
        })
        .eq("id", userId)

      if (userError) throw userError

      // Create first agent
      const template = AGENT_TEMPLATES.find((t) => t.id === selectedTemplate)
      const { error: agentError } = await supabase.from("agents").insert({
        tenant_id: tenant.id,
        name: agentName,
        system_prompt: template?.prompt || "You are a helpful AI assistant.",
        status: "active",
        timezone,
      })

      if (agentError) throw agentError

      // Create tenant branding
      await supabase.from("tenant_branding").insert({
        tenant_id: tenant.id,
        company_name: companyName,
      })

      toast.success("Your workspace is ready!")
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("Failed to complete setup. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex size-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
              s === step
                ? "bg-primary text-primary-foreground"
                : s < step
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Step 1: Workspace */}
      {step === 1 && (
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Building2 className="size-6 text-primary" />
            </div>
            <CardTitle>Create your workspace</CardTitle>
            <CardDescription>
              Set up your company workspace to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Acme Inc"
                value={companyName}
                onChange={(e) => handleCompanyNameChange(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="slug">Workspace URL</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">jazi.app/</span>
                <Input
                  id="slug"
                  placeholder="acme"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="mt-4"
              onClick={() => setStep(2)}
              disabled={!companyName || !slug}
            >
              Continue
              <ChevronRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Phone Setup */}
      {step === 2 && (
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Phone className="size-6 text-primary" />
            </div>
            <CardTitle>Set up your phone</CardTitle>
            <CardDescription>
              Choose how you want to make and receive calls
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {PHONE_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setPhoneMode(mode.id)}
                  className={`flex items-start gap-4 rounded-lg border p-4 text-left transition-colors ${
                    phoneMode === mode.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
                      phoneMode === mode.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <mode.icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">{mode.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {mode.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft data-icon="inline-start" />
                Back
              </Button>
              <Button className="flex-1" onClick={() => setStep(3)}>
                Continue
                <ChevronRight data-icon="inline-end" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: First Agent */}
      {step === 3 && (
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Bot className="size-6 text-primary" />
            </div>
            <CardTitle>Create your first agent</CardTitle>
            <CardDescription>
              Choose a template to get started quickly
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="agentName">Agent Name</Label>
              <Input
                id="agentName"
                placeholder="Sales Agent"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Template</Label>
              <div className="grid grid-cols-2 gap-2">
                {AGENT_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`rounded-lg border p-3 text-left transition-colors ${
                      selectedTemplate === template.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <p className="font-medium">{template.name}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ChevronLeft data-icon="inline-start" />
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleComplete}
                disabled={isLoading || !agentName}
              >
                {isLoading && (
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                )}
                Complete Setup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
