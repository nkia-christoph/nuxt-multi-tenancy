import { defineNuxtRouteMiddleware, useState, setPageLayout } from "#imports";
export default defineNuxtRouteMiddleware((to) => {
  const tenant = useState("multiTenancy");
  if (!tenant.value?.isResolved || !tenant.value.config.layout) return;
  if (to.meta.layout !== void 0) return;
  setPageLayout(tenant.value.config.layout);
});
