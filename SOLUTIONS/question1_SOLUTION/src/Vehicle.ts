import { FuelType } from "./FuelType.ts";

/** A vehicle for sale. Abstract: create a Car or a Boat instead. */
export abstract class Vehicle {
  /** The vehicle's colour, e.g. "Green". */
  public color: string = "";

  /** The asking price. */
  public price: number = 0;

  /** Distance travelled so far, in kilometres. */
  public kilometers: number = 0;

  /** The type of fuel the vehicle uses (defaults to PETROL). */
  public fuel: FuelType = FuelType.PETROL;
}
