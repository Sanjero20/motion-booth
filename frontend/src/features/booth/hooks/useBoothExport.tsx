import { useCallback, useRef, useState } from "react";

import {
  drawTemplate,
  loadBackgroundImage,
  loadPhotoImage,
} from "@/features/booth/services/canvas";

import { exportMotionVideo } from "@/features/booth/services/exportMotion";
import { transcodeToMp4 } from "@/features/booth/services/transcodeToMp4";
import { templatesApi } from "@/features/templates/services/templates.api";
import { eventsApi } from "@/features/events/services/events.api";

import type { Photo } from "@/features/booth/types/photo";
import type { Template } from "@/features/templates/types/template";

import { downloadBlob } from "../services/downloadBlob";

export type ExportStage = "idle" | "recording" | "converting";

export default function useBoothExport(
  selectedTemplate: Template,
  photos: Photo[],
  holdMs = 3000,
  eventId?: string,
) {
  const [exportStage, setExportStage] = useState<ExportStage>("idle");
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState<string | null>(null);

  const isGeneratingVideo = useRef(false);

  const getBackground = useCallback(
    () =>
      eventId
        ? eventsApi.getBackground(eventId)
        : templatesApi.getBackground(selectedTemplate.id),
    [eventId, selectedTemplate.id],
  );

  const generateImage = useCallback(async (): Promise<Blob> => {
    let backgroundUrl: string | null = null;

    try {
      const { layout } = selectedTemplate;

      const canvas = document.createElement("canvas");
      canvas.width = layout.width;
      canvas.height = layout.height;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Unable to create the image canvas.");
      }

      const backgroundBlob = selectedTemplate.backgroundImage
        ? await getBackground()
        : null;

      backgroundUrl = backgroundBlob
        ? URL.createObjectURL(backgroundBlob)
        : null;

      const [background, images] = await Promise.all([
        loadBackgroundImage(backgroundUrl),
        Promise.all(
          photos.slice(0, selectedTemplate.slots.length).map(loadPhotoImage),
        ),
      ]);

      drawTemplate(ctx, selectedTemplate, images, background);

      return await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Failed to export the image."));
          }
        }, "image/png");
      });
    } finally {
      if (backgroundUrl) {
        URL.revokeObjectURL(backgroundUrl);
      }
    }
  }, [selectedTemplate, photos, getBackground]);

  const generateVideo = useCallback(async (): Promise<Blob> => {
    if (isGeneratingVideo.current) {
      throw new Error("A video export is already in progress.");
    }

    isGeneratingVideo.current = true;
    setExportError(null);
    setExportProgress(0);
    setExportStage("recording");

    try {
      const recorded = await exportMotionVideo(selectedTemplate, photos, {
        holdMs,
        onProgress: (progress) => {
          setExportProgress(Math.round(progress * 100));
        },
        getBackground: selectedTemplate.backgroundImage
          ? getBackground
          : undefined,
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

      return blob;
    } finally {
      isGeneratingVideo.current = false;
      setExportStage("idle");
    }
  }, [selectedTemplate, photos, holdMs, getBackground]);

  const handleSaveImage = useCallback(async () => {
    try {
      setExportError(null);

      const blob = await generateImage();

      downloadBlob(blob, `${selectedTemplate.id}.png`);
    } catch (error) {
      setExportError(
        error instanceof Error ? error.message : "Failed to export the image.",
      );
    }
  }, [generateImage, selectedTemplate.id]);

  const handleSaveVideo = useCallback(async () => {
    try {
      setExportError(null);

      const blob = await generateVideo();

      downloadBlob(blob, `${selectedTemplate.id}.mp4`);
    } catch (error) {
      setExportError(
        error instanceof Error ? error.message : "Failed to export the video.",
      );
    }
  }, [generateVideo, selectedTemplate.id]);

  return {
    generateImage,
    generateVideo,
    handleSaveImage,
    handleSaveVideo,
    exportStage,
    exportProgress,
    exportError,
  };
}
