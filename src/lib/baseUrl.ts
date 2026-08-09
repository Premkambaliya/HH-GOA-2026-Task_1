import { headers } from "next/headers";

/**
 * Build-time origin, for metadata that must be resolved statically.
 * Netlify injects `URL` during builds, so this stays correct without config.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.URL ||
  "http://localhost:3000"
).replace(/\/+$/, "");

/**
 * Absolute origin of the current deployment.
 *
 * Crawlers (X, WhatsApp, Slack) only fetch fully-qualified og:image URLs, so an
 * unset env var must not silently degrade to localhost. Order of preference:
 * explicit config, then the platform-provided URL, then the inbound request.
 */
export async function getBaseUrl(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_BASE_URL || process.env.URL;
  if (configured) return configured.replace(/\/+$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return "http://localhost:3000";

  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
