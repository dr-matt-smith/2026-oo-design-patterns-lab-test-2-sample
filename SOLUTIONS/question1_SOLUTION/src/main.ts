import { FuelType } from "./FuelType.ts";
import { Car } from "./Car.ts";
import { Boat } from "./Boat.ts";

const car1 = new Car();
car1.setNumDoors(5);
car1.color = "Green";
car1.price = 9999;
car1.kilometers = 50000;
car1.fuel = FuelType.PETROL;

const boat23 = new Boat(1200);
boat23.color = "Blue";
boat23.price = 5000;
boat23.kilometers = 15000;
boat23.fuel = FuelType.DIESEL;

console.log("car1 =");
console.log(car1);

console.log("\n");
console.log("boat23 =");
console.log(boat23);
