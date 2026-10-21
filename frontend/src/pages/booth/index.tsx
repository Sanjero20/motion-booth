import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Camera } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

const LIMIT = 4;
const COUNTDOWN_SECONDS = 3;

type Photo = {
  id: number;
  src: string;
};

function BoothPage() {
  const [status, setStatus] = useState<"idle" | "capturing">("idle");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const capturingRef = useRef(false);

  // Request camera access and clean up when the page unmounts.
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
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
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
      capturingRef.current = false;

      activeStream?.getTracks().forEach((track) => track.stop());

      if (streamRef.current === activeStream) {
        streamRef.current = null;
      }
    };
  }, []);

  const capturePhoto = (): Photo | null => {
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

    // Mirror the captured image to match the mirrored selfie preview.
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return {
      id: Date.now(),
      src: canvas.toDataURL("image/jpeg", 0.92),
    };
  };

  const wait = (ms: number) =>
    new Promise<void>((resolve) => window.setTimeout(resolve, ms));

  const handleStart = async () => {
    if (
      capturingRef.current ||
      !streamRef.current ||
      !videoRef.current ||
      videoRef.current.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
    ) {
      return;
    }

    capturingRef.current = true;
    setStatus("capturing");
    setPhotos([]);

    try {
      for (let shot = 0; shot < LIMIT; shot++) {
        for (let seconds = COUNTDOWN_SECONDS; seconds > 0; seconds--) {
          setCountdown(seconds);
          await wait(1000);

          if (!capturingRef.current) return;
        }

        setCountdown(null);

        const photo = capturePhoto();

        if (photo) {
          setPhotos((current) => [...current, photo]);
        }

        // Brief pause before the next shot.
        if (shot < LIMIT - 1) {
          await wait(800);
        }
      }
    } finally {
      capturingRef.current = false;
      setCountdown(null);
      setStatus("idle");
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-3 p-3 sm:gap-4 sm:p-5 md:h-dvh md:overflow-hidden">
      <header className="relative flex shrink-0 items-center justify-center">
        <Link
          to="/"
          aria-label="Back to landing page"
          className="absolute left-0"
        >
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Go back</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>

        <Logo />
      </header>

      <section className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4 md:flex-row md:items-start md:justify-center">
        <div className="flex w-full flex-col gap-3 md:max-w-[calc((100dvh-11rem)*4/3)] md:flex-1">
          {/* Camera preview */}
          <div className="bg-secondary border-border relative aspect-4/3 w-full overflow-hidden rounded-md border-2">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="absolute inset-0 size-full -scale-x-100 object-cover"
            />

            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                <p className="text-muted-foreground text-sm">{cameraError}</p>
              </div>
            )}

            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="font-mono text-7xl font-bold text-white drop-shadow-lg">
                  {countdown}
                </span>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          <Button
            size="lg"
            className="h-12 w-full rounded-full text-base md:mx-auto md:w-auto md:px-12"
            onClick={handleStart}
            disabled={status !== "idle" || !!cameraError}
          >
            <Camera className="size-5" />
            {status === "idle" ? "Start" : "Get ready…"}
          </Button>
        </div>

        {/* Captured photos */}
        <aside className="grid shrink-0 grid-cols-4 gap-2 sm:gap-3 md:max-h-full md:w-28 md:grid-cols-1 md:overflow-y-auto lg:w-40">
          {Array.from({ length: LIMIT }).map((_, index) => {
            const photo = photos[index];

            return (
              <div
                key={index}
                className="bg-secondary border-border relative flex aspect-4/3 min-w-0 items-center justify-center overflow-hidden rounded-md border-2 border-dashed"
              >
                {photo ? (
                  <img
                    src={photo.src}
                    alt={`Captured photo ${index + 1}`}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground font-mono text-xs">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
              </div>
            );
          })}
        </aside>
      </section>
    </main>
  );
}

export default BoothPage;
