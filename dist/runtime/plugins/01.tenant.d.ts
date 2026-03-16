/**
 * Universal plugin that resolves the current tenant from the request hostname
 * and stores it in useState('multiTenancy') for SSR hydration.
 *
 * Runs with enforce: 'pre' to ensure tenant state is available to all other
 * plugins and components.
 */
declare const _default: import("#app").Plugin<Record<string, unknown>> & import("#app").ObjectPlugin<Record<string, unknown>>;
export default _default;
