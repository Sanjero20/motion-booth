/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import type { MotionClip, Photo } from "@/types/booth";
import type { RecordingSession } from "@/hooks/useMotionRecording";

interface Props {
  capturePhoto: () => string | null;
  videoElement: HTMLVideoElement | null;
  startRecording: (video: HTMLVideoElement) => RecordingSession;
  markCapturedMoment: (session: RecordingSession) => void;
  stopRecording: (session: RecordingSession) => Promise<MotionClip>;
  cancelRecording: (session?: RecordingSession) => void;
  limit?: number;
  countdownSeconds?: number;
}

function usePhotoCapture({
  capturePhoto,
  videoElement,
  startRecording,
  markCapturedMoment,
  stopRecording,
  cancelRecording,
  limit = 4,
  countdownSeconds = 5,
}: Props) {
  const [status, setStatus] = useState<"idle" | "capturing">("idle");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flashKey, setFlashKey] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);

  const capturingRef = useRef(false);
  const mountedRef = useRef(true);
  const timeoutIdsRef = useRef(new Set<number>());

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      capturingRef.current = false;

      timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutIdsRef.current.clear();

      cancelRecording();
    };
  }, [cancelRecording]);

  const wait = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      const id = window.setTimeout(() => {
        timeoutIdsRef.current.delete(id);
        resolve();
      }, ms);

      timeoutIdsRef.current.add(id);
    });
  }, []);

  const captureShot = useCallback(async (): Promise<Photo> => {
    if (!videoElement) {
      throw new Error("The camera is not ready.");
    }

    const session = startRecording(videoElement);

    try {
      for (let seconds = countdownSeconds; seconds > 0; seconds--) {
        if (!capturingRef.current || !mountedRef.current) {
          throw new Error("Capture cancelled.");
        }

        setCountdown(seconds);
        await wait(1000);
      }

      if (!capturingRef.current || !mountedRef.current) {
        throw new Error("Capture cancelled.");
      }

      setCountdown(null);
      markCapturedMoment(session);

      const src = capturePhoto();

      if (!src) {
        throw new Error("Unable to capture the photo.");
      }

      // Each increment remounts the flash overlay in CameraPreview
      setFlashKey((key) => key + 1);

      const motionClip = await stopRecording(session);

      return {
        id: Date.now(),
        src,
        motionClip,
      };
    } catch (error) {
      cancelRecording(session);
      throw error;
    }
  }, [
    videoElement,
    startRecording,
    countdownSeconds,
    wait,
    markCapturedMoment,
    capturePhoto,
    stopRecording,
    cancelRecording,
  ]);

  const startCapture = useCallback(async () => {
    if (capturingRef.current || !mountedRef.current) return;

    capturingRef.current = true;
    setCaptureError(null);
    setIsComplete(false);
    setStatus("capturing");
    setPhotos([]);

    try {
      for (let shot = 0; shot < limit; shot++) {
        const photo = await captureShot();

        if (!mountedRef.current) return;

        setPhotos((current) => [...current, photo]);

        if (shot < limit - 1) {
          await wait(800);
        }
      }

      if (mountedRef.current) {
        setIsComplete(true);
      }
    } catch (error) {
      if (mountedRef.current) {
        setCaptureError(
          error instanceof Error && error.message !== "Capture cancelled."
            ? error.message
            : error instanceof Error
              ? null
              : "The capture session failed.",
        );
      }
    } finally {
      capturingRef.current = false;

      if (mountedRef.current) {
        setCountdown(null);
        setStatus("idle");
      }
    }
  }, [captureShot, limit, wait]);

  const resetCapture = useCallback(() => {
    if (capturingRef.current) return;

    setIsComplete(false);
    setPhotos([]);
    setCountdown(null);
    setFlashKey(0);
    setCaptureError(null);
  }, []);

  return {
    status,
    photos,
    countdown,
    isComplete,
    startCapture,
    resetCapture,
    flashKey,
    captureError,
  };
}

export default usePhotoCapture;
