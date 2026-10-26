import { Film, Image, Loader2, RotateCcw } from "lucide-react";

import TemplatePicker from "@/components/shared/TemplatePicker";
import { Button } from "@/components/ui/button";

type BoothResultsPanelProps = {
  selectedTemplateIds: string[];
  exportStage: "idle" | "recording" | "converting";
  exportProgress: number;
  onSelectTemplate: (ids: string[]) => void;
  onSaveImage: () => void;
  onSaveVideo: () => void;
  onNewSession: () => void;
};

function BoothResultsPanel({
  selectedTemplateIds,
  exportStage,
  exportProgress,
  onSelectTemplate,
  onSaveImage,
  onSaveVideo,
  onNewSession,
}: BoothResultsPanelProps) {
  const isExporting = exportStage !== "idle";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-4xl font-semibold">
          Your moments are <em className="text-primary">ready</em>
        </h2>

        <p className="text-muted-foreground text-sm leading-relaxed">
          Each frame replays the 5 seconds before the shutter - the laugh, the
          lean-in, the almost-ready.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-display text-base font-medium">Template</h3>

        <TemplatePicker
          selectedId={selectedTemplateIds}
          onSelect={onSelectTemplate}
          layout="vertical"
        />
      </div>

      {/* Sharing: reserved for a future feature */}
      {/*
      <Button variant="outline" className="w-full" disabled>
        <QrCode className="size-4" />
        Share via QR
      </Button>
      */}

      <div className="flex flex-col gap-2">
        <Button
          onClick={onSaveVideo}
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
          onClick={onSaveImage}
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
    </div>
  );
}

export default BoothResultsPanel;
