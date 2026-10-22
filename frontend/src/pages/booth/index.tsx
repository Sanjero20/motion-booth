import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import { templates } from "@/data/templates";
import TemplateCanvas from "@/components/shared/TemplateCanvas";

import BoothHeader from "./sections/BoothHeader";
import CameraPreview from "./sections/CameraPreview";
import CapturedPhotos from "./sections/CapturedPhotos";
import BoothResultsPanel from "./sections/BoothResultsPanel";

import useCamera from "@/hooks/useCamera";
import usePhotoCapture from "@/hooks/usePhotoCapture";
import useMotionRecording from "@/hooks/useMotionRecording";

const LIMIT = 4;
const COUNTDOWN_SECONDS = 3;

function BoothPage() {
  const { videoRef, videoElement, canvasRef, cameraError, capturePhoto } =
    useCamera();

  const { startRecording, markCapturedMoment, stopRecording, cancelRecording } =
    useMotionRecording();

  const {
    status,
    photos,
    countdown,
    isComplete,
    startCapture,
    resetCapture,
    flash,
    captureError,
  } = usePhotoCapture({
    capturePhoto,
    videoElement,
    startRecording,
    markCapturedMoment,
    stopRecording,
    cancelRecording,
    limit: LIMIT,
    countdownSeconds: COUNTDOWN_SECONDS,
  });

  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([
    templates[0].id,
  ]);

  const selectedTemplate =
    templates.find((template) => template.id === selectedTemplateIds[0]) ??
    templates[0];

  const exportCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement | null) => {
    exportCanvasRef.current = canvas;
  }, []);

  const handleSaveImage = () => {
    const canvas = exportCanvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${selectedTemplate.id}.png`;
      link.click();

      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-3 p-3 sm:gap-4 sm:p-5 md:h-dvh md:overflow-hidden">
      <BoothHeader />

      <AnimatePresence mode="wait" initial={false}>
        {isComplete ? (
          <motion.section
            key="completed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex min-h-0 flex-1 flex-col gap-5 md:flex-row md:items-start md:gap-8"
          >
            {/* Completed template preview */}
            <div className="bg-secondary border-border flex min-h-[45dvh] w-full min-w-0 flex-1 items-center justify-center overflow-hidden rounded-md border-2 p-3 sm:min-h-[55dvh] sm:p-5 md:h-full md:max-h-[calc(100dvh-7rem)]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selectedTemplate.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex h-full w-full items-center justify-center"
                >
                  <TemplateCanvas
                    layout={selectedTemplate}
                    photos={photos}
                    onCanvasReady={handleCanvasReady}
                    className="max-h-full max-w-full"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Completed session controls */}
            <aside className="flex w-full shrink-0 flex-col gap-4 md:w-72 lg:w-80">
              <BoothResultsPanel
                selectedTemplateIds={selectedTemplateIds}
                onSelectTemplate={setSelectedTemplateIds}
                onSaveImage={handleSaveImage}
                onNewSession={resetCapture}
              />
            </aside>
          </motion.section>
        ) : (
          <motion.section
            key="capture"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex min-h-0 flex-1 flex-col gap-4 md:flex-row md:items-start"
          >
            {/* Main camera */}
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <CameraPreview
                videoRef={videoRef}
                canvasRef={canvasRef}
                cameraError={cameraError}
                countdown={countdown}
                flash={flash}
              />

              {captureError && (
                <p role="alert" className="text-destructive text-sm">
                  {captureError}
                </p>
              )}

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

            {/* Captured thumbnails */}
            <aside className="w-full shrink-0 md:w-28 lg:w-40">
              <CapturedPhotos limit={LIMIT} photos={photos} />
            </aside>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

export default BoothPage;
