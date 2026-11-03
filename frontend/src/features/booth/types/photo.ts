import type { MotionClip } from "./motion";

export type Photo = {
  id: number;
  src: string;
  motionClip?: MotionClip;
};
