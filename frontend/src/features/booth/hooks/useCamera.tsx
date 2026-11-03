/* eslint-disable react-hooks/immutability */
import { useCallback, useEffect, useRef, useState } from "react";

function useCamera() {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null,
  );
  const [stream, setStream] = useState<MediaStream | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Reconnects the stream whenever the video element mounts again.
  const videoRef = useCallback((element: HTMLVideoElement | null) => {
    setVideoElement(element);
  }, []);

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

        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            aspectRatio: { ideal: 4 / 3 },
          },
        });

        if (cancelled) {
          cameraStream.getTracks().forEach((track) => track.stop());
          return;
        }

        activeStream = cameraStream;
        streamRef.current = cameraStream;
        setStream(cameraStream);
        setCameraError(null);
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

      if (streamRef.current === activeStream) {
        streamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!videoElement || !stream) return;

    videoElement.srcObject = stream;

    void videoElement.play().catch(() => {
      setCameraError("Unable to start the camera preview.");
    });

    return () => {
      videoElement.srcObject = null;
    };
  }, [videoElement, stream]);

  const capturePhoto = useCallback(() => {
    const video = videoElement;
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

    // Mirror the captured image to match the preview.
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.92);
  }, [videoElement]);

  return {
    videoRef,
    videoElement,
    canvasRef,
    streamRef,
    cameraError,
    capturePhoto,
  };
}

export default useCamera;
