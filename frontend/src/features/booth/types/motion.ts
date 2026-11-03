export type MotionClip = {
  blob: Blob;
  mimeType: string;
  durationMs: number;
  captureOffsetMs: number | null;
};

export type MotionRecording = {
  markCaptureMoment: () => void;
  stop: () => void;
};
