import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function getLeadScoreColor(score: number): string {
  if (score >= 67) return "text-emerald-600 bg-emerald-100"
  if (score >= 34) return "text-amber-600 bg-amber-100"
  return "text-red-600 bg-red-100"
}

export function getLeadScoreLabel(score: number): string {
  if (score >= 67) return "Hot"
  if (score >= 34) return "Warm"
  return "Cold"
}

export function getSentimentColor(sentiment: string | null): string {
  switch (sentiment) {
    case "positive":
      return "text-emerald-600 bg-emerald-100"
    case "negative":
      return "text-red-600 bg-red-100"
    default:
      return "text-zinc-600 bg-zinc-100"
  }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function calculateBANTScore(bant: {
  budget: number
  authority: number
  need: number
  timeline: number
}): number {
  return bant.budget + bant.authority + bant.need + bant.timeline
}
