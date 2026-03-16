/**
 * Universal plugin that integrates multi-tenancy with @nuxtjs/i18n.
 *
 * Patches Vue's global $t to check tenant-specific overrides before
 * falling back to the base translations. Works with pre-compiled messages.
 */
declare const _default: import("#app").Plugin<Record<string, unknown>> & import("#app").ObjectPlugin<Record<string, unknown>>;
export default _default;
