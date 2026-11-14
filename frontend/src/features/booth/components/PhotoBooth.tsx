import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import CameraPreview from "@/pages/booth/sections/CameraPreview";

import SessionActions from "./SessionActions";
import CapturedPhotos from "@/pages/booth/sections/CapturedPhotos";
import TemplateCanvas from "@/components/shared/TemplateCanvas";

import useCamera from "../hooks/useCamera";
import usePhotoCapture from "../hooks/usePhotoCapture";
import useMotionRecording from "../hooks/useMotionRecording";

import type { Template } from "@/features/templates/types/template";
import { AnimatePresence, motion } from "motion/react";

interface Props {
  template: Template;
}

const COUNTDOWN_SECONDS = 5;
const HOLD_MS = 2000;

function PhotoBooth({ template }: Props) {
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
    flashKey,
    captureError,
  } = usePhotoCapture({
    capturePhoto,
    videoElement,
    startRecording,
    markCapturedMoment,
    stopRecording,
    cancelRecording,
    limit: template.slots.length,
    countdownSeconds: COUNTDOWN_SECONDS,
  });

  return (
    <div className="flex w-full gap-4">
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
              <div className="flex h-full w-full items-center justify-center">
                <TemplateCanvas
                  layout={template}
                  photos={photos}
                  mode="motion"
                  holdMs={HOLD_MS}
                  className="max-h-full max-w-full"
                />
              </div>
            </div>

            {/* Completed session controls */}
            <aside className="flex w-full shrink-0 flex-col gap-4 md:w-72 lg:w-80">
              {/* Heading */}
              <div className="flex flex-col gap-2">
                <h2 className="font-display text-4xl font-semibold">
                  Your moments are <em className="text-primary">ready</em>
                </h2>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  Each frame replays the 5 seconds before the shutter - the
                  laugh, the lean-in, the almost-ready.
                </p>
              </div>

              <SessionActions
                template={template}
                photos={photos}
                holdMs={HOLD_MS}
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
            {/* Main Camera */}
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <CameraPreview
                videoRef={videoRef}
                canvasRef={canvasRef}
                cameraError={cameraError}
                countdown={countdown}
                flashKey={flashKey}
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
              <CapturedPhotos limit={template.slots.length} photos={photos} />
            </aside>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PhotoBooth;
