export interface JobResponseApi {
  jobId?: string;
  jobRunId?: string | null;
  jobName?: string | null;
  jobStatus?: string | null;
  sequencesIds?: string[] | null;
  [k: string]: unknown;
}

export interface Job {
  id: string;
  runId?: string | null;
  name?: string | null;
  status?: string | null;
  sequenceIds?: string[] | null;
  raw: JobResponseApi;
}

export function jobFromApi(data: JobResponseApi): Job {
  return {
    id: (data.jobId as string) ?? (data as any).id,
    runId: data.jobRunId ?? null,
    name: data.jobName ?? null,
    status: data.jobStatus ?? null,
    sequenceIds: data.sequencesIds ?? null,
    raw: data
  };
}


