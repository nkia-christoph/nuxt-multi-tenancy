import { useState } from "#imports";
export function useTenant() {
  return useState("multiTenancy").value;
}
export function useTenantMeta() {
  return useState("multiTenancy").value?.meta ?? {};
}
