import type { Storyboard } from "@/lib/storyboard";

export type AssemblyInput = { clips: string[]; storyboard: Storyboard; audioUrl?: string };
export type AssemblyResult = { status: "mocked"; outputUrl: string | null; watermark: string };

/** Final assembly seam: replace this implementation with Remotion, Mux, or a worker later. */
export async function assembleFinalVideo(input: AssemblyInput): Promise<AssemblyResult> {
  return { status: "mocked", outputUrl: input.clips[0] ?? null, watermark: "APERÇU · MAISON MOTION" };
}
