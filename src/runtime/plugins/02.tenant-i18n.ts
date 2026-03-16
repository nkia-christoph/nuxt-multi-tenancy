import { defineNuxtPlugin, useState, useRuntimeConfig } from '#imports'
import type { ResolvedTenant, MultiTenancyPublicRuntimeConfig } from '../types'

/**
 * Extract the display string from a pre-compiled vue-i18n AST node.
 * AST format: { t: 0, b: { t: 2, i: [{ t: 3 }], s: "the string" } }
 */
function extractString(node: any): string | undefined {
  if (typeof node === 'string') return node
  if (node?.b?.s !== undefined) return node.b.s
  if (node?.s !== undefined) return node.s
  return undefined
}

/**
 * Resolve a potentially nested key (e.g., "legal.privacy") from an object.
 */
function resolveKey(obj: Record<string, any>, key: string): any {
  const parts = key.split('.')
  let current: any = obj
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined
    current = current[part]
  }
  return current
}

/**
 * Universal plugin that integrates multi-tenancy with @nuxtjs/i18n.
 *
 * Patches Vue's global $t to check tenant-specific overrides before
 * falling back to the base translations. Works with pre-compiled messages.
 */
export default defineNuxtPlugin({
  name: 'multi-tenancy-i18n',
  dependsOn: ['i18n:plugin'],
  setup(nuxtApp) {
    const mtConfig = (useRuntimeConfig().public as any).multiTenancy as MultiTenancyPublicRuntimeConfig | undefined
    if (!mtConfig) return

    const tenant = useState<ResolvedTenant>('multiTenancy')
    if (!tenant.value?.id) return

    const tenantOverrides = mtConfig.overrides?.[tenant.value.id]
    if (!tenantOverrides || Object.keys(tenantOverrides).length === 0) return

    const i18n = (nuxtApp as any).$i18n
    if (!i18n) return

    // Patch the Vue global $t to intercept overridden keys
    const globals = nuxtApp.vueApp.config.globalProperties
    const original$t = globals.$t
    if (!original$t) return

    globals.$t = (key: string, ...args: any[]) => {
      const locale = typeof i18n.locale === 'object' ? i18n.locale.value : i18n.locale
      const overrideNode = resolveKey(tenantOverrides[locale] || {}, key)
      if (overrideNode !== undefined) {
        const str = extractString(overrideNode)
        if (str !== undefined) return str
      }
      return (original$t as Function)(key, ...args)
    }
  },
})
