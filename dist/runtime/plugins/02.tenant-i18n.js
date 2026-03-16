import { defineNuxtPlugin, useState, useRuntimeConfig } from "#imports";
function extractString(node) {
  if (typeof node === "string") return node;
  if (node?.b?.s !== void 0) return node.b.s;
  if (node?.s !== void 0) return node.s;
  return void 0;
}
function resolveKey(obj, key) {
  const parts = key.split(".");
  let current = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return void 0;
    current = current[part];
  }
  return current;
}
export default defineNuxtPlugin({
  name: "multi-tenancy-i18n",
  dependsOn: ["i18n:plugin"],
  setup(nuxtApp) {
    const mtConfig = useRuntimeConfig().public.multiTenancy;
    if (!mtConfig) return;
    const tenant = useState("multiTenancy");
    if (!tenant.value?.id) return;
    const tenantOverrides = mtConfig.overrides?.[tenant.value.id];
    if (!tenantOverrides || Object.keys(tenantOverrides).length === 0) return;
    const i18n = nuxtApp.$i18n;
    if (!i18n) return;
    const globals = nuxtApp.vueApp.config.globalProperties;
    const original$t = globals.$t;
    if (!original$t) return;
    globals.$t = (key, ...args) => {
      const locale = typeof i18n.locale === "object" ? i18n.locale.value : i18n.locale;
      const overrideNode = resolveKey(tenantOverrides[locale] || {}, key);
      if (overrideNode !== void 0) {
        const str = extractString(overrideNode);
        if (str !== void 0) return str;
      }
      return original$t(key, ...args);
    };
  }
});
