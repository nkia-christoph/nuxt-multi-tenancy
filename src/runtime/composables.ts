import { useState } from '#imports'
import type { ResolvedTenant } from './types'

/**
 * Returns the resolved tenant state for the current request.
 *
 * @example
 * ```vue
 * <script setup>
 * const tenant = useTenant()
 * // tenant.id        — tenant key (e.g., 'dachl')
 * // tenant.isResolved — true when a domain matched
 * // tenant.config     — full tenant config
 * // tenant.meta       — shortcut to config.meta
 * </script>
 * ```
 */
export function useTenant(): ResolvedTenant {
  return useState<ResolvedTenant>('multiTenancy').value
}

/**
 * Shortcut to the current tenant's metadata object.
 * Returns an empty object if no tenant is resolved.
 */
export function useTenantMeta<T extends Record<string, any> = Record<string, any>>(): T {
  return useState<ResolvedTenant>('multiTenancy').value?.meta as T ?? ({} as T)
}
