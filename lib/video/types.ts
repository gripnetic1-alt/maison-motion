export type VideoJobStatus = "queued" | "storyboarding" | "rendering" | "ready" | "failed";

export type VideoJobInput = {
  assetId: string;
  assetName: string;
  assetType: import("@/lib/assets").AssetType;
  metadata: import("@/lib/assets").AssetMetadata;
  imageUrls: string[];
  storyboard: import("@/lib/storyboard").Storyboard;
  watermark: string;
};

export type VideoJob = {
  id: string;
  provider: string;
  assetType: VideoJobInput["assetType"];
  metadata: VideoJobInput["metadata"];
  status: VideoJobStatus;
  previewUrl: string | null;
  createdAt: string;
};

export interface VideoProvider {
  readonly name: string;
  createJob(input: VideoJobInput): Promise<VideoJob>;
  getJob(jobId: string): Promise<VideoJob>;
}

export type ProviderSelector = (assetType: VideoJobInput["assetType"]) => VideoProvider;
