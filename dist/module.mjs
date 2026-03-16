import { defineNuxtModule, createResolver, addServerHandler, addPlugin, addRouteMiddleware, addImports } from '@nuxt/kit';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

function compileMessageString(str) {
  return { t: 0, b: { t: 2, i: [{ t: 3 }], s: str } };
}
function compileOverrides(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      result[key] = compileMessageString(value);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      result[key] = compileOverrides(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
const module$1 = defineNuxtModule({
  meta: {
    name: "nuxt-multi-tenancy",
    configKey: "multiTenancy"
  },
  defaults: {
    tenants: {},
    defaultTenant: void 0
  },
  setup(options, nuxt) {
    const { tenants, defaultTenant } = options;
    const resolver = createResolver(import.meta.url);
    const domainMap = {};
    for (const [tenantId, config] of Object.entries(tenants)) {
      for (const domain of config.domains) {
        domainMap[domain.split(":")[0]] = tenantId;
      }
    }
    const runtimeTenants = {};
    for (const [id, config] of Object.entries(tenants)) {
      runtimeTenants[id] = {
        domains: config.domains,
        layout: config.layout,
        defaultLocale: config.defaultLocale,
        locales: config.locales,
        meta: config.meta || {}
      };
    }
    const overrides = {};
    for (const [tenantId, config] of Object.entries(tenants)) {
      overrides[tenantId] = {};
      if (config.overridesDir) {
        const overridesPath = resolve(nuxt.options.rootDir, config.overridesDir);
        if (existsSync(overridesPath)) {
          for (const file of readdirSync(overridesPath).filter((f) => f.endsWith(".json"))) {
            const locale = file.replace(".json", "");
            const raw = JSON.parse(readFileSync(join(overridesPath, file), "utf-8"));
            overrides[tenantId][locale] = compileOverrides(raw);
          }
        }
      }
      if (config.translationOverrides) {
        for (const [locale, data] of Object.entries(config.translationOverrides)) {
          if (!overrides[tenantId][locale]) {
            overrides[tenantId][locale] = compileOverrides(data);
          }
        }
      }
    }
    nuxt.options.runtimeConfig.public.multiTenancy = {
      tenants: runtimeTenants,
      domainMap,
      defaultTenantId: defaultTenant || null,
      overrides
    };
    addServerHandler({
      middleware: true,
      handler: resolver.resolve("./runtime/server/middleware/tenant")
    });
    addPlugin({
      src: resolver.resolve("./runtime/plugins/01.tenant"),
      mode: "all"
    });
    addPlugin({
      src: resolver.resolve("./runtime/plugins/02.tenant-i18n"),
      mode: "all"
    });
    addRouteMiddleware({
      name: "tenant-layout",
      path: resolver.resolve("./runtime/middleware/tenant-layout.global"),
      global: true
    });
    const composables = resolver.resolve("./runtime/composables");
    addImports([
      { from: composables, name: "useTenant" },
      { from: composables, name: "useTenantMeta" }
    ]);
  }
});

export { module$1 as default };
