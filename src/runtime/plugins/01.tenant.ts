import { defineNuxtPlugin, useState, useRequestURL, useRuntimeConfig } from '#imports'
import type { ResolvedTenant, MultiTenancyPublicRuntimeConfig } from '../types'

/**
 * Universal plugin that resolves the current tenant from the request hostname
 * and stores it in useState('multiTenancy') for SSR hydration.
 *
 * Runs with enforce: 'pre' to ensure tenant state is available to all other
 * plugins and components.
 */
export default defineNuxtPlugin({
  name: 'multi-tenancy',
  enforce: 'pre',
  setup() {
    const mtConfig = (useRuntimeConfig().public as any).multiTenancy as MultiTenancyPublicRuntimeConfig | undefined
    if (!mtConfig) return

    const { hostname } = useRequestURL()
    const tenantId = mtConfig.domainMap[hostname] || mtConfig.defaultTenantId || null
    const tenantConfig = tenantId ? mtConfig.tenants[tenantId] : null

    useState<ResolvedTenant>('multiTenancy', () => ({
      id: tenantId,
      isResolved: !!tenantId,
      config: tenantConfig || { domains: [], meta: {} },
      meta: tenantConfig?.meta || {},
    }))
  },
})
