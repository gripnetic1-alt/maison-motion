import type { VideoJob, VideoJobInput, VideoProvider } from "./types";

const jobs = new Map<string, VideoJob>();

export class MockVideoProvider implements VideoProvider {
  readonly name = "mock-local";

  async createJob(input: VideoJobInput): Promise<VideoJob> {
    const id = `mock_${input.assetId}_${input.assetType}_${input.storyboard.scenes.length}`;
    const job: VideoJob = { id, provider: this.name, assetType: input.assetType, metadata: input.metadata, status: "ready", previewUrl: input.imageUrls[0] ?? null, createdAt: new Date().toISOString() };
    jobs.set(id, job);
    return job;
  }

  async getJob(jobId: string) {
    return jobs.get(jobId) ?? { id: jobId, provider: this.name, assetType: "villa", metadata: {}, status: "failed", previewUrl: null, createdAt: new Date().toISOString() };
  }
}

export const videoProvider: VideoProvider = new MockVideoProvider();

/** One routing seam for future specialist providers; all types intentionally use mock-local today. */
export const selectVideoProvider: import("./types").ProviderSelector = () => videoProvider;
