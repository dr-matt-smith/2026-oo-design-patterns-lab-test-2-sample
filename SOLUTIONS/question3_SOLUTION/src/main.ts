import { SelfDrivingType } from "./SelfDrivingType.ts";
import { Car } from "./Car.ts";

const audiA8 = new Car(100);
audiA8.priceThousands = 100;
audiA8.selfDrivingLevel = SelfDrivingType.ADAPTIVE_CRUISE;

console.log("audiA8 =");
console.log(audiA8);
