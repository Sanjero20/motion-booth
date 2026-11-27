import { useCallback, useRef, useState } from "react";

import { eventOutputsApi } from "@/features/events/services/eventsOutput.api";

import type { EventOutput } from "@/features/events/types/eventOutput";

export type EventOutputStatus =
  "idle" | "generating" | "uploading" | "saved" | "failed";

interface Generators {
  generateImage: () => Promise<Blob>;
  generateVideo: () => Promise<Blob>;
}

export default function useEventOutput(eventId: string) {
  const [status, setStatus] = useState<EventOutputStatus>("idle");
  const [output, setOutput] = useState<EventOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const imageRef = useRef<Blob | null>(null);
  const videoRef = useRef<Blob | null>(null);

  const isProcessing = useRef(false);
  const isSaved = useRef(false);

  const uploadOutput = useCallback(
    async (image: Blob, video: Blob): Promise<boolean> => {
      setStatus("uploading");
      setError(null);

      try {
        const result = await eventOutputsApi.create(eventId, {
          image,
          video,
        });

        setOutput(result);
        setStatus("saved");
        isSaved.current = true;

        return true;
      } catch (error) {
        setStatus("failed");
        setError(
          error instanceof Error
            ? error.message
            : "Failed to save the event output.",
        );

        return false;
      }
    },
    [eventId],
  );

  const generateAndSave = useCallback(
    async ({ generateImage, generateVideo }: Generators) => {
      if (isProcessing.current || isSaved.current) return;

      isProcessing.current = true;
      setStatus("generating");
      setError(null);

      try {
        const [image, video] = await Promise.all([
          generateImage(),
          generateVideo(),
        ]);

        imageRef.current = image;
        videoRef.current = video;

        await uploadOutput(image, video);
      } catch (error) {
        setStatus("failed");
        setError(
          error instanceof Error
            ? error.message
            : "Failed to generate the event output.",
        );
      } finally {
        isProcessing.current = false;
      }
    },
    [uploadOutput],
  );

  const retryUpload = useCallback(
    async (generators?: Generators) => {
      if (isProcessing.current || isSaved.current) return;

      isProcessing.current = true;

      try {
        // Regenerate files only if generation previously failed.
        if (!imageRef.current || !videoRef.current) {
          if (!generators) return;

          setStatus("generating");
          setError(null);

          const [image, video] = await Promise.all([
            generators.generateImage(),
            generators.generateVideo(),
          ]);

          imageRef.current = image;
          videoRef.current = video;
        }

        await uploadOutput(imageRef.current, videoRef.current);
      } catch (error) {
        setStatus("failed");
        setError(
          error instanceof Error
            ? error.message
            : "Failed to retry the event output.",
        );
      } finally {
        isProcessing.current = false;
      }
    },
    [uploadOutput],
  );

  return {
    generateAndSave,
    retryUpload,
    status,
    output,
    error,
  };
}
