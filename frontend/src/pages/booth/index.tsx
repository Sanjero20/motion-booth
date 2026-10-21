import { Link } from "react-router";
import { ArrowLeft, Camera } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import CameraPreview from "./sections/CameraPreview";
import CapturedPhotos from "./sections/CapturedPhotos";
import useCamera from "@/hooks/useCamera";
import usePhotoCapture from "@/hooks/usePhotoCapture";

const LIMIT = 4;
const COUNTDOWN_SECONDS = 3;

function BoothPage() {
  const { videoRef, canvasRef, cameraError, capturePhoto } = useCamera();

  const { status, photos, countdown, startCapture } = usePhotoCapture({
    capturePhoto,
    limit: LIMIT,
    countdownSeconds: COUNTDOWN_SECONDS,
  });

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
            onClick={startCapture}
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
