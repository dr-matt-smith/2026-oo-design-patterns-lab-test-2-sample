import { Vehicle } from "./Vehicle.ts";

/** A car: a vehicle with a number of doors. */
export class Car extends Vehicle {
  private numDoors: number = 0;

  /**
   * Gets the number of doors.
   * @returns the number of doors
   */
  public getNumDoors(): number {
    return this.numDoors;
  }

  /**
   * Sets the number of doors.
   * @param numDoors the new number of doors
   */
  public setNumDoors(numDoors: number): void {
    this.numDoors = numDoors;
  }
}
