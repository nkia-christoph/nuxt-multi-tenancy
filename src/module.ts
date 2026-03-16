import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImports,
  addServerHandler,
  addRouteMiddleware,
} from '@nuxt/kit'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import type { ModuleOptions, RuntimeTenantConfig } from './runtime/types'

export type { ModuleOptions, TenantConfig, ResolvedTenant, RuntimeTenantConfig } from './runtime/types'

/**
 * Compile a plain string into the vue-i18n pre-compiled AST format.
 * This matches the output of @intlify/message-compiler for simple strings.
 */
function compileMessageString(str: string) {
  return { t: 0, b: { t: 2, i: [{ t: 3 }], s: str } }
}

/**
 * Recursively compile an override object: string values become AST nodes,
 * nested objects are recursed into, other values pass through.
 */
function compileOverrides(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = compileMessageString(value)
    }
    else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = compileOverrides(value)
    }
    else {
      result[key] = value
    }
  }
  return result
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-multi-tenancy',
    configKey: 'multiTenancy',
  },
  defaults: {
    tenants: {},
    defaultTenant: undefined,
  },
  setup(options, nuxt) {
    const { tenants, defaultTenant } = options
    const resolver = createResolver(import.meta.url)

    // Build domain -> tenant ID lookup (strip ports for normalization)
    const domainMap: Record<string, string> = {}
    for (const [tenantId, config] of Object.entries(tenants)) {
      for (const domain of config.domains) {
        domainMap[domain.split(':')[0]!] = tenantId
      }
    }

    // Serialize tenant configs for runtime (strip build-only fields)
    const runtimeTenants: Record<string, RuntimeTenantConfig> = {}
    for (const [id, config] of Object.entries(tenants)) {
      runtimeTenants[id] = {
        domains: config.domains,
        layout: config.layout,
        defaultLocale: config.defaultLocale,
        locales: config.locales,
        meta: config.meta || {},
      }
    }

    // Resolve translation overrides (file-based + inline), then compile
    // string values to vue-i18n AST format so they work with pre-compiled messages
    const overrides: Record<string, Record<string, Record<string, any>>> = {}
    for (const [tenantId, config] of Object.entries(tenants)) {
      overrides[tenantId] = {}

      // File-based overrides (higher priority)
      if (config.overridesDir) {
        const overridesPath = resolve(nuxt.options.rootDir, config.overridesDir)
        if (existsSync(overridesPath)) {
          for (const file of readdirSync(overridesPath).filter((f: string) => f.endsWith('.json'))) {
            const locale = file.replace('.json', '')
            const raw = JSON.parse(readFileSync(join(overridesPath, file), 'utf-8'))
            overrides[tenantId][locale] = compileOverrides(raw)
          }
        }
      }

      // Inline overrides (lower priority — won't overwrite file-based)
      if (config.translationOverrides) {
        for (const [locale, data] of Object.entries(config.translationOverrides)) {
          if (!overrides[tenantId][locale]) {
            overrides[tenantId][locale] = compileOverrides(data)
          }
        }
      }
    }

    // Expose config via runtimeConfig.public for universal access
    ;(nuxt.options.runtimeConfig.public as any).multiTenancy = {
      tenants: runtimeTenants,
      domainMap,
      defaultTenantId: defaultTenant || null,
      overrides,
    }

    // Server middleware: makes tenant available to Nitro API routes via event.context
    addServerHandler({
      middleware: true,
      handler: resolver.resolve('./runtime/server/middleware/tenant'),
    })

    // Universal plugin: resolves tenant from hostname, stores in useState
    addPlugin({
      src: resolver.resolve('./runtime/plugins/01.tenant'),
      mode: 'all',
    })

    // Universal plugin: applies i18n translation overrides for the active tenant
    addPlugin({
      src: resolver.resolve('./runtime/plugins/02.tenant-i18n'),
      mode: 'all',
    })

    // Route middleware: switches layout per tenant
    addRouteMiddleware({
      name: 'tenant-layout',
      path: resolver.resolve('./runtime/middleware/tenant-layout.global'),
      global: true,
    })

    // Register composables for auto-import
    const composables = resolver.resolve('./runtime/composables')
    addImports([
      { from: composables, name: 'useTenant' },
      { from: composables, name: 'useTenantMeta' },
    ])
  },
})
