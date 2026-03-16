import { defineNuxtPlugin, useState, useRequestURL, useRuntimeConfig } from "#imports";
export default defineNuxtPlugin({
  name: "multi-tenancy",
  enforce: "pre",
  setup() {
    const mtConfig = useRuntimeConfig().public.multiTenancy;
    if (!mtConfig) return;
    const { hostname } = useRequestURL();
    const tenantId = mtConfig.domainMap[hostname] || mtConfig.defaultTenantId || null;
    const tenantConfig = tenantId ? mtConfig.tenants[tenantId] : null;
    useState("multiTenancy", () => ({
      id: tenantId,
      isResolved: !!tenantId,
      config: tenantConfig || { domains: [], meta: {} },
      meta: tenantConfig?.meta || {}
    }));
  }
});
