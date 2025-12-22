export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "Lex Intel Visual Design";

export const APP_LOGO = "https://placehold.co/128x128/2563eb/ffffff?text=Lex+Intel";

// Generate login URL at runtime so redirect URI reflects the current origin.
// Returns null if OAuth is not configured (for standalone mode)
export const getLoginUrl = (): string | null => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  
  // If OAuth is not configured, return null (standalone mode)
  if (!oauthPortalUrl || !appId) {
    console.warn('OAuth not configured: VITE_OAUTH_PORTAL_URL or VITE_APP_ID not set');
    return null;
  }
  
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  try {
    const url = new URL(`${oauthPortalUrl}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return url.toString();
  } catch (error) {
    console.error('Failed to construct login URL:', error);
    return null;
  }
};
