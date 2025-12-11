import { APIError, AuthenticationError, RateLimitError } from "./errors";
import pkg from "../package.json";

export interface HTTPClientOptions {
  baseUrl: string;
  apiKey: string;
  timeoutMs?: number;
}

export class HTTPClient {
  private baseUrl: string;
  private timeoutMs: number;
  private headers: Record<string, string>;

  constructor(opts: HTTPClientOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/+$/, "");
    this.timeoutMs = typeof opts.timeoutMs === "number" ? opts.timeoutMs : 30000;
    const version = (pkg as any)?.version || "0";
    this.headers = {
      "Authorization": `Bearer ${opts.apiKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": `fastfold-ts/${version}`
    };
  }

  async post<T = unknown>(path: string, body?: unknown, query?: Record<string, string | number | boolean | undefined | null>): Promise<T> {
    const url = this.buildUrl(path, query);
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: this.headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });
      return await this.handleResponse<T>(res);
    } finally {
      clearTimeout(id);
    }
  }

  private buildUrl(path: string, query?: Record<string, string | number | boolean | undefined | null>): string {
    const url = new URL(this.baseUrl + path);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v === undefined || v === null) continue;
        url.searchParams.set(k, String(v));
      }
    }
    return url.toString();
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    const status = res.status;
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      // ignore json parse errors; we'll still check status
    }

    if (status === 401) {
      const msg = data?.message ?? "Unauthorized";
      throw new AuthenticationError(msg);
    }
    if (status === 429) {
      const msg = data?.message ?? "Too Many Requests";
      throw new RateLimitError(msg, 429, data);
    }
    if (status >= 400) {
      const msg = data?.message ?? `HTTP ${status}`;
      throw new APIError(msg, status, data);
    }
    if (data == null) {
      throw new APIError("Invalid JSON response from server", status);
    }
    return data as T;
  }
}


