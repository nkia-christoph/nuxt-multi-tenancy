import { defineEventHandler, getRequestHost, useRuntimeConfig } from "#imports";
export default defineEventHandler((event) => {
  const host = getRequestHost(event, { xForwardedHost: true });
  const hostname = host.split(":")[0];
  const mtConfig = useRuntimeConfig(event).public.multiTenancy;
  if (!mtConfig) return;
  const tenantId = (hostname ? mtConfig.domainMap[hostname] : void 0) || mtConfig.defaultTenantId || null;
  event.context.multiTenancy = {
    tenantId,
    config: tenantId ? mtConfig.tenants[tenantId] : null
  };
});
