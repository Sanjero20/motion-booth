import { useEffect, useRef } from "react";
import type { Ref, RefObject } from "react";

interface Props {
  videoRef: Ref<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  cameraError: string | null;
  countdown: number | null;
  flashKey: number;
}

const FLASH_DURATION_MS = 350;

function CameraPreview({
  videoRef,
  canvasRef,
  cameraError,
  countdown,
  flashKey,
}: Props) {
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (flashKey === 0) return;

    const animation = flashRef.current?.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: FLASH_DURATION_MS, easing: "ease-out", fill: "none" },
    );

    return () => animation?.cancel();
  }, [flashKey]);

  return (
    <div className="bg-secondary border-border relative aspect-4/3 w-full overflow-hidden rounded-md border-2">
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

      {/* Flash overlay: last so it always paints on top */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 z-20 bg-white opacity-0"
      />

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default CameraPreview;
