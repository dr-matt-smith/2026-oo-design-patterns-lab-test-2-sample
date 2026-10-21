// type 1 tests = TYPE_1_ConGetSet = Construction / default values / Getters / interfaces

import { assertEquals, assertExists, assertFalse } from "@std/assert";
import { SelfDrivingType } from "../src/SelfDrivingType.ts";
import type { Intelligence } from "../src/Intelligence.ts";
import type { ElectricHybrid } from "../src/ElectricHybrid.ts";
import { Car } from "../src/Car.ts";

Deno.test("test_01_TYPE_1_ConGetSet_SelfDrivingTypeHasThreeValues", () => {
  // Arrange
  const expectedResult = ["CRUISE_CONTROL", "ADAPTIVE_CRUISE", "AUTONOMOUS_DRIVING"];

  // Act
  const result = Object.keys(SelfDrivingType);

  // Assert
  assertEquals(result, expectedResult);
});

Deno.test("test_02_TYPE_1_ConGetSet_CarNotNullAfterConstruction", () => {
  // Arrange
  const car = new Car(50);

  // Act

  // Assert
  assertExists(car);
});

Deno.test("test_03_TYPE_1_ConGetSet_DefaultValuesAfterConstruction", () => {
  // Arrange
  const car = new Car(50);

  // Act

  // Assert
  assertEquals(car.priceThousands, 0);
  assertEquals(car.selfDrivingLevel, SelfDrivingType.CRUISE_CONTROL);
});

Deno.test("test_04_TYPE_1_ConGetSet_ElectricRangeCorrectAfterConstruction", () => {
  // Arrange
  const car = new Car(50);
  const expectedResult = 50;

  // Act
  const result = car.getElectricRange();

  // Assert
  assertEquals(result, expectedResult);
});

Deno.test("test_05_TYPE_1_ConGetSet_ElectricRangeCorrectAfterAnotherConstruction", () => {
  // Arrange
  const car = new Car(100);
  const expectedResult = 100;

  // Act
  const result = car.getElectricRange();

  // Assert
  assertEquals(result, expectedResult);
});

Deno.test("test_06_TYPE_1_ConGetSet_CarHasNoElectricRangeSetter", () => {
  // Arrange
  const car = new Car(50);

  // Act
  const result = "setElectricRange" in car;

  // Assert
  assertFalse(result);
});

Deno.test("test_07_TYPE_1_ConGetSet_SelfDrivingLevelCorrectAfterSet", () => {
  // Arrange
  const car = new Car(50);
  car.selfDrivingLevel = SelfDrivingType.AUTONOMOUS_DRIVING;
  const expectedResult = SelfDrivingType.AUTONOMOUS_DRIVING;

  // Act
  const result = car.getSelfDrivingLevel();

  // Assert
  assertEquals(result, expectedResult);
});

Deno.test("test_08_TYPE_1_ConGetSet_CarCanBeUsedAsIntelligence", () => {
  // Arrange - this line only type-checks if Car implements Intelligence
  const intelligence: Intelligence = new Car(50);
  const expectedResult = SelfDrivingType.CRUISE_CONTROL;

  // Act
  const result = intelligence.getSelfDrivingLevel();

  // Assert
  assertEquals(result, expectedResult);
});

Deno.test("test_09_TYPE_1_ConGetSet_CarCanBeUsedAsElectricHybrid", () => {
  // Arrange - this line only type-checks if Car implements ElectricHybrid
  const hybrid: ElectricHybrid = new Car(75);
  const expectedResult = 75;

  // Act
  const result = hybrid.getElectricRange();

  // Assert
  assertEquals(result, expectedResult);
});
