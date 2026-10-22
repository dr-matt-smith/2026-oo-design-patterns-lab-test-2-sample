// type 1 tests = TYPE_1_ConGetSet = Constructor / Getters / Setters

import { assertEquals, assertExists } from "@std/assert";
import { ShoppingList } from "../src/ShoppingList.ts";

Deno.test("test_01_TYPE_1_ConGetSet_NotNullAfterConstruction", () => {
  // Arrange
  const myList = new ShoppingList("party");

  // Act

  // Assert
  assertExists(myList);
});

Deno.test("test_02_TYPE_1_ConGetSet_ListNameCorrectAfterValidConstruction", () => {
  // Arrange
  const myList = new ShoppingList("party");
  const expectedResult = "party";

  // Act
  const result = myList.getName();

  // Assert
  assertEquals(result, expectedResult);
});

Deno.test("test_03_TYPE_1_ConGetSet_ListNameCorrectAfterAnotherValidConstruction", () => {
  // Arrange
  const myList = new ShoppingList("weekend");
  const expectedResult = "weekend";

  // Act
  const result = myList.getName();

  // Assert
  assertEquals(result, expectedResult);
});

Deno.test("test_04_TYPE_1_ConGetSet_DefaultArrayAfterConstruction", () => {
  // Arrange
  const myList = new ShoppingList("party");
  const expectedResult = ["bread", "eggs", "milk"];

  // Act
  const result = myList.getList();

  // Assert
  assertEquals(result, expectedResult);
});

Deno.test("test_05_TYPE_1_ConGetSet_ThreeItemsAfterConstruction", () => {
  // Arrange
  const myList = new ShoppingList("party");
  const expectedResult = 3;

  // Act
  const result = myList.getNumItems();

  // Assert
  assertEquals(result, expectedResult);
});
