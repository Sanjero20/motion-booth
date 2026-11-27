import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

import type { Template } from "@/features/templates/types/template";
import type { Photo } from "../types/photo";

import useBoothExport from "../hooks/useBoothExport";
import useEventOutput from "../hooks/useEventOutput";

import {
  Film,
  Image,
  Loader2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Props {
  template: Template;
  photos: Photo[];
  holdMs: number;
  onNewSession: () => void;
  eventId?: string;
}

function SessionActions({
  template,
  photos,
  holdMs,
  onNewSession,
  eventId,
}: Props) {
  const {
    generateImage,
    generateVideo,
    handleSaveImage,
    handleSaveVideo,
    exportStage,
    exportProgress,
    exportError,
  } = useBoothExport(template, photos, holdMs, eventId);

  const {
    generateAndSave,
    retryUpload,
    downloadImage,
    downloadVideo,
    hasGeneratedFiles,
    status,
    error,
  } = useEventOutput(eventId ?? "");

  const autoSaveStarted = useRef(false);

  useEffect(() => {
    if (!eventId || autoSaveStarted.current) return;

    autoSaveStarted.current = true;

    void generateAndSave({
      generateImage,
      generateVideo,
    });
  }, [eventId, generateAndSave, generateImage, generateVideo]);

  const isExporting = exportStage !== "idle";
  const canStartNewSession = !eventId || status === "saved";

  return (
    <>
      {eventId ? (
        <div className="flex flex-col gap-3 rounded-lg border p-4">
          {status === "generating" && (
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="text-primary size-4 animate-spin" />
              <span>Preparing your photo and video...</span>
            </div>
          )}

          {status === "uploading" && (
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="text-primary size-4 animate-spin" />
              <span>Saving your output...</span>
            </div>
          )}

          {status === "saved" && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="size-4" />
              <span>Output saved successfully!</span>
            </div>
          )}

          {status === "failed" && (
            <div className="flex flex-col gap-3">
              <div className="text-destructive flex items-start gap-2 text-sm">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />

                <div className="flex flex-col gap-1">
                  <span className="font-medium">
                    Failed to save your output.
                  </span>
                  <span>{error}</span>
                </div>
              </div>

              <Button
                onClick={() =>
                  retryUpload({
                    generateImage,
                    generateVideo,
                  })
                }
                variant="outline"
                className="w-full"
              >
                <RotateCcw className="size-4" />
                Retry
              </Button>
            </div>
          )}

          {hasGeneratedFiles && (
            <div className="flex flex-col gap-2">
              <Button
                onClick={downloadImage}
                variant="outline"
                className="w-full"
              >
                <Image className="size-4" />
                Download photo
              </Button>

              <Button
                onClick={downloadVideo}
                variant="outline"
                className="w-full"
              >
                <Film className="size-4" />
                Download video
              </Button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSaveVideo}
              disabled={isExporting}
              variant="outline"
              className="relative isolate w-full overflow-hidden rounded-lg"
            >
              {isExporting && (
                <span
                  aria-hidden="true"
                  className="bg-primary/30 absolute inset-y-0 left-0 -z-10 w-full transition-[width] duration-200 ease-linear"
                  style={{
                    width: `${Math.min(100, Math.max(0, exportProgress))}%`,
                  }}
                />
              )}

              {isExporting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Film size={16} />
              )}

              <span>{isExporting ? "Exporting..." : "Save video"}</span>

              {isExporting && (
                <span className="tabular-nums">{exportProgress}%</span>
              )}
            </Button>

            <Button
              className="w-full rounded-lg"
              variant="outline"
              onClick={handleSaveImage}
              disabled={isExporting}
            >
              <Image size={16} />
              Download photo
            </Button>
          </div>

          {exportError && (
            <p role="alert" className="text-destructive text-sm">
              {exportError}
            </p>
          )}
        </>
      )}

      <div className="border-t pt-4">
        <Button
          variant="outline"
          className="w-full rounded-lg"
          onClick={onNewSession}
          disabled={!canStartNewSession}
        >
          <RotateCcw className="size-4" />
          New session
        </Button>

        {eventId && status !== "saved" && (
          <p className="text-muted-foreground mt-2 text-center text-xs">
            Save your current output before starting a new session.
          </p>
        )}
      </div>
    </>
  );
}

export default SessionActions;
