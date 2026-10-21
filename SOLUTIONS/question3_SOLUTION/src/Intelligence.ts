import { SelfDrivingType } from "./SelfDrivingType.ts";

/** Something that can drive itself, at some level. */
export interface Intelligence {
  /**
   * Gets how much of the driving it can do by itself.
   * @returns the self-driving level
   */
  getSelfDrivingLevel(): SelfDrivingType;
}
