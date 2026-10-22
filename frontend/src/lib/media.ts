const MP4_MIME_TYPES = [
  "video/mp4;codecs=avc1.42E01E",
  "video/mp4;codecs=avc1",
  "video/mp4",
] as const;

export function getSupportedMimeType(): string | null {
  if (typeof MediaRecorder === "undefined") {
    return null;
  }

  return (
    MP4_MIME_TYPES.find((mimeType) =>
      MediaRecorder.isTypeSupported(mimeType),
    ) ?? null
  );
}
