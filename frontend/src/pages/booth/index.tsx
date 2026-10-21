import { useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Camera } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import CameraPreview from "./sections/CameraPreview";
import CapturedPhotos from "./sections/CapturedPhotos";
import useCamera from "@/hooks/useCamera";
import type { Photo } from "@/types/booth";

const LIMIT = 4;
const COUNTDOWN_SECONDS = 3;

function BoothPage() {
  const [status, setStatus] = useState<"idle" | "capturing">("idle");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);

  const capturingRef = useRef(false);

  const { videoRef, canvasRef, streamRef, cameraError, capturePhoto } =
    useCamera();

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
          setPhotos((current) => [...current, { id: Date.now(), src: photo }]);
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
          <CameraPreview
            videoRef={videoRef}
            canvasRef={canvasRef}
            cameraError={cameraError}
            countdown={countdown}
          />

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
        <CapturedPhotos limit={LIMIT} photos={photos} />
      </section>
    </main>
  );
}

export default BoothPage;
