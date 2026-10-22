import { Download, RotateCcw } from "lucide-react";

import TemplatePicker from "@/components/shared/TemplatePicker";
import { Button } from "@/components/ui/button";

type BoothResultsPanelProps = {
  selectedTemplateIds: string[];
  onSelectTemplate: (ids: string[]) => void;
  onSaveImage: () => void;
  onNewSession: () => void;
};

function BoothResultsPanel({
  selectedTemplateIds,
  onSelectTemplate,
  onSaveImage,
  onNewSession,
}: BoothResultsPanelProps) {
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
        {/* <Button variant="outline" className="w-full rounded-lg" disabled>
          <Video className="size-4" />
          Download motion video
        </Button> */}

        <Button className="w-full rounded-lg" onClick={onSaveImage}>
          <Download className="size-4" />
          Download photo
        </Button>
      </div>

      <div className="border-t pt-4">
        <Button
          variant="outline"
          className="w-full rounded-lg"
          onClick={onNewSession}
        >
          <RotateCcw className="size-4" />
          New session
        </Button>
      </div>
    </div>
  );
}

export default BoothResultsPanel;
