/**
 * Global route middleware that applies the tenant-specific layout.
 *
 * Only sets the layout when:
 * 1. A tenant is resolved and has a layout configured
 * 2. The target page does not explicitly define its own layout
 */
declare const _default: import("#app").RouteMiddleware;
export default _default;
