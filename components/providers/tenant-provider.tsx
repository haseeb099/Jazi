"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Tenant, User } from "@/types/database"

interface TenantContextValue {
  tenant: Tenant | null
  user: User | null
}

const TenantContext = createContext<TenantContextValue>({
  tenant: null,
  user: null,
})

export function TenantProvider({
  tenant,
  user,
  children,
}: {
  tenant: Tenant | null
  user: User | null
  children: ReactNode
}) {
  return (
    <TenantContext.Provider value={{ tenant, user }}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context
}
