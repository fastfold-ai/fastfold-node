import { HTTPClient } from "../http";
import { Job, jobFromApi } from "../models";

export interface FoldCreateOptions {
  sequence: string;
  model: string;
  name?: string;
  fromId?: string;
  params?: Record<string, unknown>;
  constraints?: Record<string, unknown>;
}

export class FoldService {
  private http: HTTPClient;
  constructor(http: HTTPClient) {
    this.http = http;
  }

  async create(opts: FoldCreateOptions): Promise<Job> {
    const payload: Record<string, unknown> = {
      name: opts.name || "FastFold Job",
      sequences: [
        {
          proteinChain: { sequence: opts.sequence }
        }
      ],
      params: {
        modelName: opts.model
      }
    };

    if (opts.params) {
      Object.assign(payload.params as Record<string, unknown>, opts.params);
    }
    if (opts.constraints) {
      (payload as any).constraints = opts.constraints;
    }

    const query: Record<string, string | undefined> = {};
    if (opts.fromId) {
      query["from"] = opts.fromId;
    }

    const data = await this.http.post("/v1/jobs", payload, query);
    return jobFromApi(data as any);
  }
}


