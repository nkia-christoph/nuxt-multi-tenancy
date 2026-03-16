import type { ResolvedTenant } from './types.js';
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
export declare function useTenant(): ResolvedTenant;
/**
 * Shortcut to the current tenant's metadata object.
 * Returns an empty object if no tenant is resolved.
 */
export declare function useTenantMeta<T extends Record<string, any> = Record<string, any>>(): T;
