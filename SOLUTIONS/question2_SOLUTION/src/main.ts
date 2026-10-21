import { Mouse as DeviceMouse } from "./devices/Mouse.ts";
import { Mouse as RodentMouse } from "./rodents/Mouse.ts";

const appleMagic = new DeviceMouse();
appleMagic.laser = true;
appleMagic.weightKilos = 0.1;

const dormouse = new RodentMouse();
dormouse.setWeightGrams(30);

console.log("appleMagic =");
console.log(appleMagic);

console.log("\n");
console.log("dormouse =");
console.log(dormouse);
