import { SelfDrivingType } from "./SelfDrivingType.ts";
import type { Intelligence } from "./Intelligence.ts";
import type { ElectricHybrid } from "./ElectricHybrid.ts";

/** A car with some self-driving ability and an electric range. */
export class Car implements Intelligence, ElectricHybrid {
  /** The price, in thousands. */
  public priceThousands: number = 0;

  /** How much of the driving the car can do by itself (defaults to CRUISE_CONTROL). */
  public selfDrivingLevel: SelfDrivingType = SelfDrivingType.CRUISE_CONTROL;

  private electricRange: number;

  /**
   * Creates a car with the given electric range.
   * @param electricRange how far the car can go on electric power alone, in kilometres
   */
  constructor(electricRange: number) {
    this.electricRange = electricRange;
  }

  /**
   * Gets how much of the driving the car can do by itself.
   * @returns the self-driving level
   */
  public getSelfDrivingLevel(): SelfDrivingType {
    return this.selfDrivingLevel;
  }

  /**
   * Gets how far the car can go on electric power alone.
   * @returns the electric range, in kilometres
   */
  public getElectricRange(): number {
    return this.electricRange;
  }
}
