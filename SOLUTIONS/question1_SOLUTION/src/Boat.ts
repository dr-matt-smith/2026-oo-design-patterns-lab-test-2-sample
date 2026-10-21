import { Vehicle } from "./Vehicle.ts";

/** A boat: a vehicle with an engine power rating. */
export class Boat extends Vehicle {
  private horsepower: number;

  /**
   * Creates a boat with the given engine power.
   * @param horsepower the engine's power, in horsepower
   */
  constructor(horsepower: number) {
    super();
    this.horsepower = horsepower;
  }

  /**
   * Gets the engine's power.
   * @returns the engine's power, in horsepower
   */
  public getHorsepower(): number {
    return this.horsepower;
  }
}
