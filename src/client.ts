import { HTTPClient } from "./http";
import { AuthenticationError } from "./errors";
import { FoldService } from "./services/fold";

export interface ClientOptions {
  apiKey?: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export class Client {
  readonly fold: FoldService;
  private http: HTTPClient;

  constructor(opts: ClientOptions = {}) {
    const apiKey = opts.apiKey || process.env.FASTFOLD_API_KEY;
    if (!apiKey) {
      throw new AuthenticationError(
        "FASTFOLD_API_KEY is not set and no apiKey was provided. " +
        "Set the environment variable or pass { apiKey } to new Client()."
      );
    }
    const baseUrl = opts.baseUrl || process.env.FASTFOLD_BASE_URL || "https://api.fastfold.ai";
    this.http = new HTTPClient({
      baseUrl,
      apiKey,
      timeoutMs: opts.timeoutMs
    });
    this.fold = new FoldService(this.http);
  }
}


