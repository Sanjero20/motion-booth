import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const CORE_URL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

let ffmpegPromise: Promise<FFmpeg> | null = null;

// Loaded lazily and cached, so the ~30 MB core is only fetched when needed
function getFFmpeg(): Promise<FFmpeg> {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const ffmpeg = new FFmpeg();

      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${CORE_URL}/ffmpeg-core.js`,
          "text/javascript",
        ),
        wasmURL: await toBlobURL(
          `${CORE_URL}/ffmpeg-core.wasm`,
          "application/wasm",
        ),
      });

      return ffmpeg;
    })().catch((error) => {
      ffmpegPromise = null; // allow retry
      throw error;
    });
  }

  return ffmpegPromise;
}

export async function transcodeToMp4(
  input: Blob,
  onProgress?: (progress: number) => void,
): Promise<Blob> {
  const ffmpeg = await getFFmpeg();

  const handleProgress = ({ progress }: { progress: number }) =>
    onProgress?.(Math.min(Math.max(progress, 0), 1));

  ffmpeg.on("progress", handleProgress);

  try {
    await ffmpeg.writeFile("input.webm", await fetchFile(input));

    await ffmpeg.exec([
      "-i",
      "input.webm",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p", // required for QuickTime/iOS playback
      "-vf",
      "scale=trunc(iw/2)*2:trunc(ih/2)*2", // H.264 needs even dimensions
      "-r",
      "30", // MediaRecorder output has variable frame rate
      "-movflags",
      "+faststart",
      "-an",
      "output.mp4",
    ]);

    const data = await ffmpeg.readFile("output.mp4");

    if (typeof data === "string") {
      throw new Error("Unexpected output from ffmpeg.");
    }

    // Copy into a fresh Uint8Array so it is backed by a plain ArrayBuffer
    return new Blob([new Uint8Array(data)], { type: "video/mp4" });
  } finally {
    ffmpeg.off("progress", handleProgress);
    await ffmpeg.deleteFile("input.webm").catch(() => {});
    await ffmpeg.deleteFile("output.mp4").catch(() => {});
  }
}
