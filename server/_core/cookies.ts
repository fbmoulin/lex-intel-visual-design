import type { CookieOptions, Request } from "express";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function isIpAddress(host: string) {
  // Basic IPv4 check and IPv6 presence detection.
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes(":");
}

function isSecureRequest(req: Request) {
  if (req.protocol === "https") return true;

  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;

  const protoList = Array.isArray(forwardedProto)
    ? forwardedProto
    : forwardedProto.split(",");

  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}

/**
 * Determine appropriate SameSite value based on environment and request
 *
 * - "lax": Default, provides CSRF protection while allowing OAuth redirects
 * - "none": Required for cross-origin scenarios (requires secure=true)
 * - "strict": Maximum security but may break OAuth flows
 *
 * Note: OAuth top-level redirects work with "lax" because they are
 * top-level navigations, not embedded requests.
 */
function getSameSiteValue(req: Request): "lax" | "none" | "strict" {
  const isSecure = isSecureRequest(req);

  // In development without HTTPS, we can't use "none" (requires secure)
  // Use "lax" which still allows OAuth redirects
  if (!isSecure) {
    return "lax";
  }

  // Check if cross-origin cookies are explicitly required
  // This can be configured via environment variable if needed
  const requireCrossOrigin = process.env.COOKIE_CROSS_ORIGIN === "true";

  if (requireCrossOrigin) {
    // "none" allows cross-origin but requires secure=true
    return "none";
  }

  // Default to "lax" for better CSRF protection
  // OAuth redirects still work because they are top-level navigations
  return "lax";
}

export function getSessionCookieOptions(
  req: Request
): Pick<CookieOptions, "domain" | "httpOnly" | "path" | "sameSite" | "secure"> {
  const isSecure = isSecureRequest(req);
  const sameSite = getSameSiteValue(req);

  // If sameSite is "none", secure MUST be true
  // This is enforced by browsers
  const secure = sameSite === "none" ? true : isSecure;

  return {
    httpOnly: true,
    path: "/",
    sameSite,
    secure,
  };
}
