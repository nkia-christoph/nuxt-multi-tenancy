<template>
  <div>
    <section style="background: #f9fafb; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
      <h2 style="margin-top: 0;">Tenant Info</h2>
      <dl style="display: grid; grid-template-columns: auto 1fr; gap: 0.5rem 1rem;">
        <dt style="font-weight: 600;">ID</dt>
        <dd style="margin: 0;">{{ tenant.id ?? 'none' }}</dd>
        <dt style="font-weight: 600;">Resolved</dt>
        <dd style="margin: 0;">{{ tenant.isResolved }}</dd>
        <dt style="font-weight: 600;">Layout</dt>
        <dd style="margin: 0;">{{ tenant.config.layout ?? 'default' }}</dd>
        <dt style="font-weight: 600;">Default locale</dt>
        <dd style="margin: 0;">{{ tenant.config.defaultLocale ?? '-' }}</dd>
        <dt style="font-weight: 600;">Allowed locales</dt>
        <dd style="margin: 0;">{{ tenant.config.locales?.join(', ') ?? 'all' }}</dd>
      </dl>
    </section>

    <section style="background: #f9fafb; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
      <h2 style="margin-top: 0;">Metadata</h2>
      <pre style="background: #1f2937; color: #e5e7eb; padding: 1rem; border-radius: 4px; overflow-x: auto;">{{ JSON.stringify(tenant.meta, null, 2) }}</pre>
    </section>

    <section style="background: #f9fafb; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
      <h2 style="margin-top: 0;">Translations (with overrides)</h2>
      <p><strong>site_title:</strong> {{ $t('site_title') }}</p>
      <p><strong>welcome:</strong> {{ $t('welcome') }}</p>
      <p><strong>company_slogan:</strong> {{ $t('company_slogan') }}</p>
    </section>

    <section style="background: #f0fdf4; border-radius: 8px; padding: 1.5rem;">
      <h2 style="margin-top: 0;">Try it</h2>
      <p>Visit these URLs to see different tenants:</p>
      <ul style="padding-left: 1.5rem; list-style: disc;">
        <li><a href="http://acme.localhost:3000">http://acme.localhost:3000</a> — Acme Corp (English)</li>
        <li><a href="http://globex.localhost:3000">http://globex.localhost:3000</a> — Globex GmbH (German)</li>
        <li><a href="http://localhost:3000">http://localhost:3000</a> — falls back to Acme (default tenant)</li>
      </ul>
      <p style="color: #6b7280; font-size: 0.875rem; margin-top: 0.5rem;">
        Modern browsers resolve *.localhost to 127.0.0.1 automatically.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
const tenant = useTenant()
</script>
