import { NextRequest, NextResponse } from "next/server";
import ffprobe from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfprobePath(ffprobe.path);

// Resolve YouTube URLs to a direct stream using yt-dlp (server-side only)
async function resolveUrl(url: string): Promise<string> {
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  if (!isYouTube) return url;

  try {
    const { execSync } = await import("child_process");
    // Check if yt-dlp is installed
    try {
      execSync("yt-dlp --version", { stdio: "ignore" });
    } catch {
      throw new Error("yt-dlp is not installed on the server. YouTube analysis is unavailable.");
    }

    const directUrl = execSync(
      `yt-dlp -f "best[ext=mp4]" --get-url "${url}"`,
      { encoding: "utf-8" }
    ).trim();
    return directUrl;
  } catch (err: any) {
    throw new Error(`Failed to resolve YouTube URL: ${err.message}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ message: "Missing url" }, { status: 400 });

    const resolvedUrl = await resolveUrl(url);

    const metadata = await new Promise<ffmpeg.FfprobeData>((resolve, reject) => {
      ffmpeg.ffprobe(resolvedUrl, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    const videoStream = metadata.streams.find((s: any) => s.codec_type === "video");
    const audioStream = metadata.streams.find((s: any) => s.codec_type === "audio");
    const fpsParts = videoStream?.r_frame_rate?.split("/") ?? ["30", "1"];
    const fps = parseFloat(fpsParts[0]) / parseFloat(fpsParts[1]);

    return NextResponse.json({
      durationSeconds: parseFloat(metadata.format.duration?.toString() ?? "0"),
      fps: Math.round(fps),
      width: videoStream?.width ?? 1280,
      height: videoStream?.height ?? 720,
      hasAudio: !!audioStream,
      audioDurationSeconds: parseFloat(
        (audioStream?.duration ?? metadata.format.duration ?? "0").toString()
      ),
      source: "url",
      originalUrl: url,
    });
  } catch (err: any) {
    console.error("Video analysis error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
