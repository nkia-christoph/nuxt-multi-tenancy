import { defineEventHandler, getRequestHost, useRuntimeConfig } from '#imports'

/**
 * Nitro server middleware that resolves the current tenant from the request
 * hostname and stores it in event.context.multiTenancy.
 *
 * This makes tenant info available to server API routes and other middleware.
 */
export default defineEventHandler((event) => {
  const host = getRequestHost(event, { xForwardedHost: true })
  const hostname = host.split(':')[0]

  const mtConfig = (useRuntimeConfig(event).public as any).multiTenancy
  if (!mtConfig) return

  const tenantId: string | null = (hostname ? mtConfig.domainMap[hostname] : undefined) || mtConfig.defaultTenantId || null

  event.context.multiTenancy = {
    tenantId,
    config: tenantId ? mtConfig.tenants[tenantId] : null,
  }
})
