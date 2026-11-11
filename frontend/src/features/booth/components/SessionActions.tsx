import { Button } from "@/components/ui/button";
import type { TemplateLayout } from "@/features/templates/types/template";
import type { Photo } from "../types/photo";
import useBoothExport from "../hooks/useBoothExport";
import { Film, Image, Loader2, QrCode, RotateCcw } from "lucide-react";

interface Props {
  template: TemplateLayout;
  photos: Photo[];
  holdMs: number;
  onNewSession: () => void;
  allowSharing?: boolean;
}

function SessionActions({
  template,
  photos,
  holdMs,
  onNewSession,
  allowSharing = false,
}: Props) {
  const {
    handleSaveImage,
    handleSaveVideo,
    exportStage,
    exportProgress,
    exportError,
  } = useBoothExport(template, photos, holdMs);

  const isExporting = exportStage !== "idle";

  return (
    <>
      {allowSharing && (
        <Button variant="default" className="w-full">
          <QrCode className="size-4" />
          Share via QR
        </Button>
      )}

      <div className="flex flex-col gap-2">
        <Button
          onClick={handleSaveVideo}
          disabled={isExporting}
          variant={"outline"}
          className="relative isolate w-full overflow-hidden rounded-lg"
        >
          {/* Animated left-to-right progress fill */}
          {isExporting && (
            <span
              aria-hidden="true"
              className="bg-primary/30 absolute inset-y-0 left-0 -z-10 w-full items-center justify-center transition-[width] duration-200 ease-linear"
              style={{
                width: `${Math.min(100, Math.max(0, exportProgress))}%`,
              }}
            />
          )}

          {isExporting ? (
            <Loader2 size={16} className="animate animate-spin" />
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
      <div className="border-t pt-4">
        <Button
          variant="outline"
          className="w-full rounded-lg"
          onClick={onNewSession}
          disabled={isExporting}
        >
          <RotateCcw className="size-4" />
          New session
        </Button>
      </div>
      {exportError && (
        <p role="alert" className="text-destructive text-sm">
          {exportError}
        </p>
      )}
    </>
  );
}

export default SessionActions;
