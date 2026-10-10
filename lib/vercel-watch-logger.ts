/**
 * VercelWatch Logger SDK (TypeScript) - Artı Temizlik Züccaciye
 */
export interface VercelWatchConfig {
  watchUrl?: string;
  apiKey?: string;
  defaultProjectId?: string;
  defaultProjectName?: string;
  defaultProjectUrl?: string;
}

export interface WatchLogPayload {
  projectId?: string;
  projectName?: string;
  projectUrl?: string;
  event:
    | "LOGIN_SUCCESS"
    | "LOGIN_FAILED"
    | "LOGIN_BLOCKED"
    | "LOGOUT"
    | "SUSPICIOUS_ACCESS"
    | string;
  username: string;
  ip?: string;
  userAgent?: string;
  details?: string;
  notifyTelegram?: boolean;
}

const DEFAULT_PROJECT_ID =
  process.env.NEXT_PUBLIC_VERCEL_WATCH_PROJECT_ID ||
  process.env.VERCEL_WATCH_PROJECT_ID ||
  "arti-temizlik-zuccaciye";

const DEFAULT_PROJECT_NAME =
  process.env.NEXT_PUBLIC_VERCEL_WATCH_PROJECT_NAME ||
  process.env.VERCEL_WATCH_PROJECT_NAME ||
  "arti-temizlik-zuccaciye";

const DEFAULT_PROJECT_URL =
  process.env.NEXT_PUBLIC_VERCEL_WATCH_PROJECT_URL ||
  process.env.VERCEL_WATCH_PROJECT_URL ||
  "https://arti-temizlik-zuccaciye.vercel.app";

const defaultConfig: VercelWatchConfig = {
  watchUrl:
    process.env.VERCEL_WATCH_URL ||
    process.env.NEXT_PUBLIC_VERCEL_WATCH_URL ||
    "https://vercel-website-security.vercel.app",
  apiKey: process.env.VERCEL_WATCH_API_KEY || process.env.WATCH_API_KEY,
  defaultProjectId: DEFAULT_PROJECT_ID,
  defaultProjectName: DEFAULT_PROJECT_NAME,
  defaultProjectUrl: DEFAULT_PROJECT_URL,
};

export function extractClientIp(req?: any): string {
  if (!req) return "127.0.0.1";
  const getHeader = (name: string): string | null => {
    if (typeof req.headers?.get === "function") return req.headers.get(name);
    if (req.headers && typeof req.headers[name] === "string") return req.headers[name];
    if (req.headers && Array.isArray(req.headers[name])) return req.headers[name][0];
    return null;
  };
  const xForwardedFor = getHeader("x-forwarded-for");
  if (xForwardedFor) return xForwardedFor.split(",")[0].trim();
  const cfConnectingIp = getHeader("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();
  const xRealIp = getHeader("x-real-ip");
  if (xRealIp) return xRealIp.trim();
  return "127.0.0.1";
}

export function extractUserAgent(req?: any): string {
  if (!req) {
    if (typeof navigator !== "undefined" && navigator.userAgent) return navigator.userAgent;
    return "";
  }
  if (typeof req.headers?.get === "function") return req.headers.get("user-agent") || "";
  if (req.headers && typeof req.headers["user-agent"] === "string") return req.headers["user-agent"];
  if (typeof navigator !== "undefined" && navigator.userAgent) return navigator.userAgent;
  return "";
}

export async function sendWatchLog(
  payload: WatchLogPayload,
  config: VercelWatchConfig = {}
): Promise<boolean> {
  const watchUrl = (
    config.watchUrl ||
    defaultConfig.watchUrl ||
    ""
  ).replace(/\/+$/, "");
  const apiKey = config.apiKey || defaultConfig.apiKey;
  if (!watchUrl) return false;

  const finalPayload = {
    projectId:
      payload.projectId ||
      config.defaultProjectId ||
      defaultConfig.defaultProjectId ||
      DEFAULT_PROJECT_ID,
    projectName:
      payload.projectName ||
      config.defaultProjectName ||
      defaultConfig.defaultProjectName ||
      DEFAULT_PROJECT_NAME,
    projectUrl:
      payload.projectUrl ||
      config.defaultProjectUrl ||
      defaultConfig.defaultProjectUrl ||
      DEFAULT_PROJECT_URL,
    event: payload.event,
    username: payload.username || "admin",
    ip: payload.ip || "127.0.0.1",
    userAgent: payload.userAgent || extractUserAgent(),
    details: payload.details || "",
    notifyTelegram: payload.notifyTelegram ?? true,
    timestamp: new Date().toISOString(),
  };

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey) headers["x-api-key"] = apiKey;

    const res = await fetch(`${watchUrl}/api/ingest`, {
      method: "POST",
      headers,
      body: JSON.stringify(finalPayload),
      signal: AbortSignal.timeout(4000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function logLoginSuccess(params: {
  projectId?: string;
  username?: string;
  req?: any;
  ip?: string;
  userAgent?: string;
  details?: string;
  notifyTelegram?: boolean;
}) {
  void sendWatchLog({
    projectId: params.projectId || defaultConfig.defaultProjectId || DEFAULT_PROJECT_ID,
    event: "LOGIN_SUCCESS",
    username: params.username || "admin",
    ip: params.ip || extractClientIp(params.req),
    userAgent: params.userAgent || extractUserAgent(params.req),
    details: params.details || "Yönetim paneline başarılı giriş yapıldı.",
    notifyTelegram: params.notifyTelegram ?? true,
  });
}

export function logLoginFailed(params: {
  projectId?: string;
  username?: string;
  req?: any;
  ip?: string;
  userAgent?: string;
  details?: string;
  notifyTelegram?: boolean;
}) {
  void sendWatchLog({
    projectId: params.projectId || defaultConfig.defaultProjectId || DEFAULT_PROJECT_ID,
    event: "LOGIN_FAILED",
    username: params.username || "admin",
    ip: params.ip || extractClientIp(params.req),
    userAgent: params.userAgent || extractUserAgent(params.req),
    details: params.details || "Hatalı şifre / PIN denemesi.",
    notifyTelegram: params.notifyTelegram ?? true,
  });
}

export function logLoginBlocked(params: {
  projectId?: string;
  username?: string;
  req?: any;
  ip?: string;
  userAgent?: string;
  details?: string;
  notifyTelegram?: boolean;
}) {
  void sendWatchLog({
    projectId: params.projectId || defaultConfig.defaultProjectId || DEFAULT_PROJECT_ID,
    event: "LOGIN_BLOCKED",
    username: params.username || "admin",
    ip: params.ip || extractClientIp(params.req),
    userAgent: params.userAgent || extractUserAgent(params.req),
    details: params.details || "Çok sayıda hatalı deneme nedeniyle IP kilitlendi.",
    notifyTelegram: params.notifyTelegram ?? true,
  });
}

export function logLogout(params: {
  projectId?: string;
  username?: string;
  req?: any;
  ip?: string;
  userAgent?: string;
  details?: string;
  notifyTelegram?: boolean;
}) {
  void sendWatchLog({
    projectId: params.projectId || defaultConfig.defaultProjectId || DEFAULT_PROJECT_ID,
    event: "LOGOUT",
    username: params.username || "admin",
    ip: params.ip || extractClientIp(params.req),
    userAgent: params.userAgent || extractUserAgent(params.req),
    details: params.details || "Oturum kapatıldı.",
    notifyTelegram: params.notifyTelegram ?? false,
  });
}
