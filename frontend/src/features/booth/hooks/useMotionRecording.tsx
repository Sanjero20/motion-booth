import { getSupportedMimeType } from "@/features/booth/services/media";
import { useCallback, useRef } from "react";

import type { MotionClip } from "@/features/booth/types/motion";

export type RecordingSession = {
  recorder: MediaRecorder;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  video: HTMLVideoElement;
  stream: MediaStream;
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
        throw new Error("A recording is already in progress.");
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
        throw new Error("WebM recording is not supported by this browser.");
      }

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Unable to create the recording canvas.");
      }

      const stream = canvas.captureStream(24);
      const recorder = new MediaRecorder(stream, { mimeType });

      const session: RecordingSession = {
        recorder,
        canvas,
        context,
        video,
        stream,
        chunks: [],
        startedAt: 0,
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
        if (event.data.size > 0) {
          session.chunks.push(event.data);
        }
      };

      sessionRef.current = session;
      recorder.start(100);
      session.startedAt = performance.now();
      drawFrame();

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
        const { recorder, stream, canvas } = session;

        if (recorder.state === "inactive") {
          reject(new Error("The recording has already stopped."));
          return;
        }

        cancelAnimationFrame(session.animationFrame);

        recorder.onerror = () => {
          if (sessionRef.current === session) {
            sessionRef.current = null;
          }

          stream.getTracks().forEach((track) => track.stop());
          reject(new Error("Failed to record the motion clip."));
        };

        recorder.onstop = () => {
          if (sessionRef.current === session) {
            sessionRef.current = null;
          }

          stream.getTracks().forEach((track) => track.stop());

          resolve({
            blob: new Blob(session.chunks, {
              type: recorder.mimeType,
            }),
            mimeType: recorder.mimeType,
            durationMs: performance.now() - session.startedAt,
            captureOffsetMs: session.captureOffsetMs,
          });

          canvas.width = 0;
          canvas.height = 0;
        };

        recorder.stop();
      }),
    [],
  );

  const cancelRecording = useCallback((session?: RecordingSession) => {
    const activeSession = sessionRef.current;

    if (!activeSession) return;
    if (session && session !== activeSession) return;

    sessionRef.current = null;

    cancelAnimationFrame(activeSession.animationFrame);

    const { recorder, stream, canvas } = activeSession;

    recorder.ondataavailable = null;
    recorder.onstop = null;
    recorder.onerror = null;

    if (recorder.state !== "inactive") {
      recorder.stop();
    }

    stream.getTracks().forEach((track) => track.stop());
    canvas.width = 0;
    canvas.height = 0;
  }, []);

  return {
    startRecording,
    markCapturedMoment,
    stopRecording,
    cancelRecording,
  };
}

export default useMotionRecording;
