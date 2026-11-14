import type { Photo } from "@/features/booth/types/photo";
import type { Template } from "@/features/templates/types/template";

import {
  loadBackgroundImage,
  loadPhotoImage,
} from "@/features/booth/services/canvas";

import { renderFrame } from "@/features/booth/services/canvas/renderFrame";

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
  template: Template,
  photos: Photo[],
  { holdMs = 3000, flashMs = 300, fps = 30, onProgress }: Options = {},
): Promise<ExportedVideo> {
  const mimeType = getExportMimeType();

  if (!mimeType) {
    throw new Error("Video export is not supported by this browser.");
  }

  const clips = photos.slice(0, template.slots.length);

  const canvas = document.createElement("canvas");
  canvas.width = template.layout.width;
  canvas.height = template.layout.height;

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

  let stream: MediaStream | null = null;

  try {
    const [background, loadedVideos, stills] = await Promise.all([
      loadBackgroundImage(template.backgroundImage),

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

    stream = canvas.captureStream(fps);

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

    // Draw the initial frame before recording.
    const startedAt = performance.now();

    recorder.start(100);

    videos.forEach((video) => {
      if (video) void video.play().catch(() => {});
    });

    const maxMs = longestClipMs + holdMs + 3000;

    await new Promise<void>((resolve) => {
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
          template,
          stills,
          videos,
          finishedAt,
          now,
          flashMs,
          background,
        });

        const totalMs = longestClipMs + 300 + holdMs;
        onProgress?.(Math.min(elapsed / totalMs, 1));

        if ((allDone && now - lastFinish >= holdMs) || elapsed > maxMs) {
          resolve();
          return;
        }

        requestAnimationFrame(render);
      };

      render();
    });

    recorder.stop();
    await stopped;

    stream.getTracks().forEach((track) => track.stop());
    stream = null;

    onProgress?.(1);

    return {
      blob: new Blob(chunks, { type: recorder.mimeType }),
      extension: recorder.mimeType.includes("mp4") ? "mp4" : "webm",
    };
  } finally {
    stream?.getTracks().forEach((track) => track.stop());
    cleanup();
  }
}
