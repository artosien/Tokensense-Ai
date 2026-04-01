export interface VideoMetadata {
  durationSeconds: number;
  fps: number;
  width: number;
  height: number;
  hasAudio: boolean;
  audioDurationSeconds: number;
  fileSizeMb?: number;
  source: "file" | "url";
  originalUrl?: string;
}

// Client-side: works for uploaded files only
export async function analyzeVideoFile(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;
    video.onloadedmetadata = () => {
      resolve({
        durationSeconds: video.duration,
        fps: 30,  // browsers don't expose fps; use 30 as default
        width: video.videoWidth,
        height: video.videoHeight,
        hasAudio: true,
        audioDurationSeconds: video.duration,
        fileSizeMb: file.size / (1024 * 1024),
        source: "file",
      });
      URL.revokeObjectURL(url);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read video metadata. Check the file format."));
    };
  });
}

// For URLs: call the server-side route that uses ffprobe
export async function analyzeVideoUrl(url: string): Promise<VideoMetadata> {
  const res = await fetch("/api/video-planner/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to analyze video URL");
  }
  return res.json();
}
