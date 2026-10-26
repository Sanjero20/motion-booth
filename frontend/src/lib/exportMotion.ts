import { loadPhotoImage } from "@/lib/canvas";
import { renderFrame } from "@/lib/canvas/renderFrame";
import type { Photo, TemplateLayout } from "@/types/booth";

const MIME_CANDIDATES = [
  "video/mp4;codecs=avc1.42E01E",
  "video/mp4;codecs=avc1",
  "video/mp4",
  "video/webm;codecs=vp9",
  "video/webm;codecs=vp8",
  "video/webm",
];

function getExportMimeType(): string | null {
  if (typeof MediaRecorder === "undefined") return null;

  return (
    MIME_CANDIDATES.find((type) => MediaRecorder.isTypeSupported(type)) ?? null
  );
}

interface Options {
  holdMs?: number;
  flashMs?: number;
  fps?: number;
  onProgress?: (progress: number) => void;
}

export interface ExportedVideo {
  blob: Blob;
  extension: "mp4" | "webm";
}

export async function exportMotionVideo(
  layout: TemplateLayout,
  photos: Photo[],
  { holdMs = 3000, flashMs = 300, fps = 30, onProgress }: Options = {},
): Promise<ExportedVideo> {
  const mimeType = getExportMimeType();

  if (!mimeType) {
    throw new Error("Video export is not supported by this browser.");
  }

  const clips = photos.slice(0, layout.slots.length);

  const canvas = document.createElement("canvas");
  canvas.width = layout.width;
  canvas.height = layout.height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to create the export canvas.");
  }

  const urls: string[] = [];
  const videos: (HTMLVideoElement | null)[] = [];

  const cleanup = () => {
    videos.forEach((video) => {
      if (!video) return;

      video.pause();
      video.removeAttribute("src");
      video.load();
    });

    urls.forEach((url) => URL.revokeObjectURL(url));
  };

  try {
    const [loadedVideos, stills] = await Promise.all([
      Promise.all(
        clips.map(async (photo) => {
          if (!photo.motionClip) return null;

          const url = URL.createObjectURL(photo.motionClip.blob);
          urls.push(url);

          const video = document.createElement("video");
          video.src = url;
          video.muted = true;
          video.loop = false;
          video.playsInline = true;
          video.preload = "auto";

          await new Promise<void>((resolve) => {
            video.onloadeddata = () => resolve();
            video.onerror = () => resolve();
          });

          return video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
            ? video
            : null;
        }),
      ),
      Promise.all(clips.map(loadPhotoImage)),
    ]);

    loadedVideos.forEach((video, index) => {
      videos[index] = video;
    });

    const longestClipMs = Math.max(
      0,
      ...clips.map((photo) => photo.motionClip?.durationMs ?? 0),
    );

    const stream = canvas.captureStream(fps);

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 5_000_000,
    });

    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    const stopped = new Promise<void>((resolve, reject) => {
      recorder.onstop = () => resolve();
      recorder.onerror = () => reject(new Error("Failed to record the video."));
    });

    const finishedAt: (number | null)[] = clips.map(() => null);

    recorder.start(100);

    const startedAt = performance.now();

    videos.forEach((video) => {
      if (video) void video.play().catch(() => {});
    });

    const maxMs = longestClipMs + holdMs + 3000;

    await new Promise<void>((resolve) => {
      let animationFrame = 0;

      const render = () => {
        const now = performance.now();
        const elapsed = now - startedAt;

        clips.forEach((photo, index) => {
          if (finishedAt[index] !== null) return;

          const video = videos[index];
          const durationMs = photo.motionClip?.durationMs ?? 0;

          const clipFinished =
            !video || video.ended || elapsed > durationMs + 300;

          if (clipFinished) {
            video?.pause();
            finishedAt[index] = now;
          }
        });

        const { allDone, lastFinish } = renderFrame({
          ctx,
          layout,
          stills,
          videos,
          finishedAt,
          now,
          flashMs,
        });

        const totalMs = longestClipMs + 300 + holdMs;
        onProgress?.(Math.min(elapsed / totalMs, 1));

        if ((allDone && now - lastFinish >= holdMs) || elapsed > maxMs) {
          resolve();
          return;
        }

        animationFrame = requestAnimationFrame(render);
      };

      render();

      // Keep the animation frame handle local to this recording.
      void animationFrame;
    });

    recorder.stop();
    await stopped;

    stream.getTracks().forEach((track) => track.stop());

    onProgress?.(1);

    return {
      blob: new Blob(chunks, { type: recorder.mimeType }),
      extension: recorder.mimeType.includes("mp4") ? "mp4" : "webm",
    };
  } finally {
    cleanup();
  }
}
