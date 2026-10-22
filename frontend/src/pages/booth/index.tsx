import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import { templates } from "@/data/templates";
import TemplateCanvas from "@/components/shared/TemplateCanvas";

import BoothHeader from "./sections/BoothHeader";
import CameraPreview from "./sections/CameraPreview";
import CapturedPhotos from "./sections/CapturedPhotos";

import useCamera from "@/hooks/useCamera";
import usePhotoCapture from "@/hooks/usePhotoCapture";
import BoothResultsPanel from "./sections/BoothResultsPanel";

const LIMIT = 4;
const COUNTDOWN_SECONDS = 3;

function BoothPage() {
  const { videoRef, canvasRef, cameraError, capturePhoto } = useCamera();

  const {
    status,
    photos,
    countdown,
    isComplete,
    startCapture,
    resetCapture,
    flash,
  } = usePhotoCapture({
    capturePhoto,
    limit: LIMIT,
    countdownSeconds: COUNTDOWN_SECONDS,
  });

  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([
    templates[0].id,
  ]);

  const selectedTemplate =
    templates.find((template) => template.id == selectedTemplateIds[0]) ??
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

      <section className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4 md:flex-row md:items-start md:justify-center">
        <div className="flex w-full flex-col gap-3 md:max-w-[calc((100dvh-11rem)*4/3)] md:flex-1">
          <AnimatePresence mode="wait" initial={false}>
            {isComplete ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-secondary border-border relative flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-md border-2"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={selectedTemplate.id}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex h-120 w-full max-w-96 items-center justify-center"
                  >
                    <TemplateCanvas
                      layout={selectedTemplate}
                      photos={photos}
                      onCanvasReady={handleCanvasReady}
                      className="max-h-full max-w-full"
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="camera"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex w-full flex-col gap-3"
              >
                <CameraPreview
                  videoRef={videoRef}
                  canvasRef={canvasRef}
                  cameraError={cameraError}
                  countdown={countdown}
                  flash={flash}
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-4 md:w-56 lg:w-64">
          <AnimatePresence mode="wait" initial={false}>
            {isComplete ? (
              <motion.div
                key="result-controls"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col gap-4"
              >
                <BoothResultsPanel
                  selectedTemplateIds={selectedTemplateIds}
                  onSelectTemplate={setSelectedTemplateIds}
                  onSaveImage={handleSaveImage}
                  onNewSession={resetCapture}
                />
              </motion.div>
            ) : (
              <motion.div
                key="captured-photos"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CapturedPhotos limit={LIMIT} photos={photos} />
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </section>
    </main>
  );
}

export default BoothPage;
