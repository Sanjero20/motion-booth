import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/types/booth";

interface Props {
  capturePhoto: () => string | null;
  limit?: number;
  countdownSeconds?: number;
}

function usePhotoCapture({
  capturePhoto,
  limit = 4,
  countdownSeconds = 5,
}: Props) {
  const [status, setStatus] = useState<"idle" | "capturing">("idle");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  const capturingRef = useRef(false);
  const mountedRef = useRef(true);
  const timeoutIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    mountedRef.current = true;
    capturingRef.current = false;

    timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutIdsRef.current.clear();
  }, []);

  const wait = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      const id = window.setTimeout(() => {
        timeoutIdsRef.current.delete(id);
        resolve();
      }, ms);
    });
  }, []);

  const startCapture = useCallback(async () => {
    if (capturingRef.current || !mountedRef.current) return;

    capturingRef.current = true;
    setStatus("capturing");
    setPhotos([]);

    try {
      //
      for (let shot = 0; shot < limit; shot++) {
        // Initiate countdown timer
        for (let seconds = countdownSeconds; seconds > 0; seconds--) {
          if (!capturingRef.current || !mountedRef.current) return;
          setCountdown(seconds);
          await wait(1000);
        }

        if (!capturingRef.current || !mountedRef.current) return;

        setCountdown(null);

        const photo = capturePhoto();

        if (photo) {
          setPhotos((current) => [...current, { id: Date.now(), src: photo }]);

          setFlash(true);
          await wait(80);

          if (mountedRef.current) {
            setFlash(false);
          }
        }

        // Brief pause before the next shot.
        if (shot < limit - 1) {
          await wait(800);
        }
      }
    } finally {
      capturingRef.current = false;

      if (mountedRef.current) {
        setCountdown(null);
        setStatus("idle");
      }
    }
  }, [capturePhoto, countdownSeconds, limit, wait]);

  return { status, photos, countdown, startCapture, flash };
}

export default usePhotoCapture;
