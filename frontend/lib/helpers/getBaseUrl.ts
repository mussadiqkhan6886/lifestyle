export const getBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // If a valid production URL is configured and not pointing to local dev
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl.replace(/\/+$/, "");
  }

  // When deployed on Vercel
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback to local dev
  return (envUrl || "http://localhost:4000").replace(/\/+$/, "");
};
