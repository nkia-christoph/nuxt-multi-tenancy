import { defineNuxtRouteMiddleware, useState, setPageLayout } from '#imports'
import type { ResolvedTenant } from '../types'

/**
 * Global route middleware that applies the tenant-specific layout.
 *
 * Only sets the layout when:
 * 1. A tenant is resolved and has a layout configured
 * 2. The target page does not explicitly define its own layout
 */
export default defineNuxtRouteMiddleware((to) => {
  const tenant = useState<ResolvedTenant>('multiTenancy')

  if (!tenant.value?.isResolved || !tenant.value.config.layout) return

  // Respect pages that explicitly set their own layout via definePageMeta()
  if (to.meta.layout !== undefined) return

  setPageLayout(tenant.value.config.layout)
})
