import { useCallback, useEffect, useRef, useState } from "react";

function useCamera() {
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let cancelled = false;
    let activeStream: MediaStream | null = null;

    async function connectCamera() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error(
            "Camera access is unavailable. Use HTTPS or localhost.",
          );
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            aspectRatio: { ideal: 4 / 3 },
          },
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
        }

        activeStream = stream;
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (error) {
        if (cancelled) return;

        setCameraError(
          error instanceof Error
            ? error.message
            : "Unable to access the camera.",
        );
      }
    }

    void connectCamera();

    return () => {
      cancelled = true;

      activeStream?.getTracks().forEach((track) => track.stop());

      if (streamRef.current == activeStream) {
        streamRef.current = null;
      }
    };
  }, []);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (
      !video ||
      !canvas ||
      video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
    ) {
      return null;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) return null;

    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.92);
  }, []);

  return { videoRef, canvasRef, streamRef, cameraError, capturePhoto };
}

export default useCamera;
