import type { RefObject } from "react";

interface Props {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  cameraError: string | null;
  countdown: number | null;
  flash: boolean;
}

function CameraPreview({
  videoRef,
  canvasRef,
  cameraError,
  countdown,
  flash,
}: Props) {
  return (
    <div className="bg-secondary border-border relative aspect-4/3 w-full overflow-hidden rounded-md border-2">
      <div
        className={`pointer-events-none absolute inset-0 z-10 bg-white transition-opacity duration-100 ${
          flash ? "opacity-100" : "opacity-0"
        }`}
      />

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 size-full -scale-x-100 object-cover"
      />

      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
          <p className="text-muted-foreground text-sm">{cameraError}</p>
        </div>
      )}

      {countdown !== null && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <span className="font-mono text-7xl font-bold text-white drop-shadow-lg">
            {countdown}
          </span>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default CameraPreview;
