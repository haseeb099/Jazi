'use client'

import { useContext, createContext, ReactNode } from 'react'

interface TenantContextType {
  tenantId?: string
  role?: string
}

export const TenantContext = createContext<TenantContextType>({})

export function useTenant() {
  const context = useContext(TenantContext)
  return context
}
