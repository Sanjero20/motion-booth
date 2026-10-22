import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Camera, Download, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { templates } from "@/data/templates";
import TemplatePicker from "@/components/shared/TemplatePicker";
import TemplateCanvas from "@/components/shared/TemplateCanvas";

import BoothHeader from "./sections/BoothHeader";
import CameraPreview from "./sections/CameraPreview";
import CapturedPhotos from "./sections/CapturedPhotos";

import useCamera from "@/hooks/useCamera";
import usePhotoCapture from "@/hooks/usePhotoCapture";

const LIMIT = 4;
const COUNTDOWN_SECONDS = 3;

function BoothPage() {
  const { videoRef, canvasRef, cameraError, capturePhoto } = useCamera();

  const { status, photos, countdown, isComplete, startCapture, flash } =
    usePhotoCapture({
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
          {isComplete ? (
            <div className="bg-secondary border-border relative flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-md border-2">
              <div className="flex h-120 w-full max-w-96 items-center justify-center">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={selectedTemplate.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="flex h-full items-center justify-center"
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
            </div>
          ) : (
            <>
              {/* Camera preview */}
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
            </>
          )}
        </div>

        <aside className="flex w-full shrink-0 flex-col gap-4 md:w-56 lg:w-64">
          {isComplete ? (
            <>
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-lg font-medium">
                  Choose a template
                </h2>

                <TemplatePicker
                  selectedId={selectedTemplateIds}
                  onSelect={setSelectedTemplateIds}
                  layout="vertical"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Button className="w-full" onClick={handleSaveImage}>
                  <Download className="size-4" />
                  Save image
                </Button>

                <Button variant="outline" className="w-full" disabled>
                  <Video className="size-4" />
                  Save video — Soon
                </Button>
              </div>
            </>
          ) : (
            <CapturedPhotos limit={LIMIT} photos={photos} />
          )}
        </aside>
      </section>
    </main>
  );
}

export default BoothPage;
