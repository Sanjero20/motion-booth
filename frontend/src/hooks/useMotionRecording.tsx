import { getSupportedMimeType } from "@/lib/media";
import type { MotionClip } from "@/types/booth";
import { useCallback, useRef } from "react";

type RecordingSession = {
  recorder: MediaRecorder;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  video: HTMLVideoElement;
  chunks: Blob[];
  startedAt: number;
  animationFrame: number;
  captureOffsetMs: number | null;
};

function useMotionRecording() {
  const sessionRef = useRef<RecordingSession | null>(null);

  const startRecording = useCallback(
    (video: HTMLVideoElement): RecordingSession => {
      if (sessionRef.current) {
        throw new Error("A recording is already in progress");
      }

      if (
        video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
        !video.videoWidth ||
        !video.videoHeight
      ) {
        throw new Error("The camera is not ready to record.");
      }

      const mimeType = getSupportedMimeType();

      if (!mimeType) {
        throw new Error("MP4 recording is not supported by this browser.");
      }

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Unable to create the recording canvas.");
      }

      const recordingStream = canvas.captureStream(24);
      const recorder = new MediaRecorder(recordingStream, { mimeType });
      const chunks: Blob[] = [];

      const session: RecordingSession = {
        recorder,
        canvas,
        context,
        video,
        chunks,
        startedAt: performance.now(),
        animationFrame: 0,
        captureOffsetMs: null,
      };

      const drawFrame = () => {
        if (recorder.state !== "recording") return;

        context.save();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        context.restore();

        session.animationFrame = requestAnimationFrame(drawFrame);
      };

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      sessionRef.current = session;
      drawFrame();
      recorder.start(100);

      return session;
    },

    [],
  );

  const markCapturedMoment = useCallback((session: RecordingSession) => {
    session.captureOffsetMs = performance.now() - session.startedAt;
  }, []);

  const stopRecording = useCallback(
    (session: RecordingSession): Promise<MotionClip> =>
      new Promise((resolve, reject) => {
        const { recorder, canvas, animationFrame } = session;

        if (recorder.state === "inactive") {
          reject(new Error("The recording has already stopped."));
          return;
        }

        cancelAnimationFrame(animationFrame);

        recorder.onstop = () => {
          sessionRef.current = null;
          canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);

          canvas
            .captureStream()
            .getTracks()
            .forEach((track) => track.stop());

          resolve({
            blob: new Blob(session.chunks, { type: recorder.mimeType }),
            mimeType: recorder.mimeType,
            durationMs: performance.now() - session.startedAt,
            captureOffsetMs: session.captureOffsetMs,
          });
        };

        recorder.onerror = () => {
          sessionRef.current = null;
          reject(new Error("Failed to record the motion clip."));
        };

        recorder.stop();
      }),
    [],
  );

  return { startRecording, markCapturedMoment, stopRecording };
}

export default useMotionRecording;
