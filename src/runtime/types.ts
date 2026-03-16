export interface TenantConfig {
  /** Domains that map to this tenant (e.g., ['tagesdosis.at', 'www.tagesdosis.at']) */
  domains: string[]
  /** Layout name to apply (must match a file in layouts/) */
  layout?: string
  /** Default locale code for this tenant */
  defaultLocale?: string
  /** Allowed locale codes (subset of i18n locales). If omitted, all locales are available. */
  locales?: string[]
  /** Path to directory containing per-locale override JSON files (relative to project root) */
  overridesDir?: string
  /** Inline translation overrides: { localeCode: { key: value } } */
  translationOverrides?: Record<string, Record<string, any>>
  /** Arbitrary metadata accessible via useTenant().meta (brand name, theme tokens, etc.) */
  meta?: Record<string, any>
}

export interface ModuleOptions {
  /** Tenant definitions keyed by tenant ID */
  tenants: Record<string, TenantConfig>
  /** Fallback tenant ID when no domain matches the request hostname */
  defaultTenant?: string
}

/** Runtime-safe tenant config (without build-only fields) */
export interface RuntimeTenantConfig {
  domains: string[]
  layout?: string
  defaultLocale?: string
  locales?: string[]
  meta: Record<string, any>
}

/** Resolved tenant state provided via useState('multiTenancy') */
export interface ResolvedTenant {
  /** Tenant ID (key from tenants config), null if unresolved */
  id: string | null
  /** Whether a matching tenant was found for the current domain */
  isResolved: boolean
  /** Tenant configuration (empty defaults if unresolved) */
  config: RuntimeTenantConfig
  /** Shortcut to config.meta */
  meta: Record<string, any>
}

/** Runtime config shape added to runtimeConfig.public */
export interface MultiTenancyPublicRuntimeConfig {
  tenants: Record<string, RuntimeTenantConfig>
  domainMap: Record<string, string>
  defaultTenantId: string | null
  overrides: Record<string, Record<string, Record<string, any>>>
}
