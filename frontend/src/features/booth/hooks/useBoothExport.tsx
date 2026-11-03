import { useState } from "react";

import { drawTemplate, loadPhotoImage } from "@/features/booth/services/canvas";
import { exportMotionVideo } from "@/features/booth/services/exportMotion";
import { transcodeToMp4 } from "@/features/booth/services/transcodeToMp4";

import type { Photo } from "@/features/booth/types/photo";
import type { TemplateLayout } from "@/features/templates/types/template";

export type ExportStage = "idle" | "recording" | "converting";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  // Give the browser time to start the download.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function useBoothExport(
  selectedTemplate: TemplateLayout,
  photos: Photo[],
  holdMs = 3000,
) {
  const [exportStage, setExportStage] = useState<ExportStage>("idle");
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleSaveImage = async () => {
    try {
      setExportError(null);

      const canvas = document.createElement("canvas");
      canvas.width = selectedTemplate.width;
      canvas.height = selectedTemplate.height;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Unable to create the image canvas.");
      }

      const images = await Promise.all(
        photos.slice(0, selectedTemplate.slots.length).map(loadPhotoImage),
      );

      drawTemplate(ctx, selectedTemplate, images);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Failed to export the image."));
          }
        }, "image/png");
      });

      downloadBlob(blob, `${selectedTemplate.id}.png`);
    } catch (error) {
      setExportError(
        error instanceof Error ? error.message : "Failed to export the image.",
      );
    }
  };

  const handleSaveVideo = async () => {
    if (exportStage !== "idle") return;

    setExportError(null);
    setExportProgress(0);
    setExportStage("recording");

    try {
      const recorded = await exportMotionVideo(selectedTemplate, photos, {
        holdMs,
        onProgress: (progress) => {
          setExportProgress(Math.round(progress * 100));
        },
      });

      let blob = recorded.blob;

      if (recorded.extension !== "mp4") {
        setExportStage("converting");
        setExportProgress(0);

        blob = await transcodeToMp4(recorded.blob, (progress) => {
          setExportProgress(Math.round(progress * 100));
        });
      }

      setExportProgress(100);
      downloadBlob(blob, `${selectedTemplate.id}.mp4`);
    } catch (error) {
      setExportError(
        error instanceof Error ? error.message : "Failed to export the video.",
      );
    } finally {
      setExportStage("idle");
    }
  };

  return {
    handleSaveImage,
    handleSaveVideo,
    exportStage,
    exportProgress,
    exportError,
  };
}
