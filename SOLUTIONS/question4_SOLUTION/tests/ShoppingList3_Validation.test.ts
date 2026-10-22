// type 3 tests = TYPE_3_Validation

import { assertEquals, assertFalse } from "@std/assert";
import { ShoppingList } from "../src/ShoppingList.ts";

Deno.test("test_08_TYPE_3_Validation_LastErrorNoneAfterValidConstruction", () => {
  // Arrange
  const myList = new ShoppingList("party");
  const expectedResult = "none";

  // Act
  const result = myList.getLastError();

  // Assert
  assertEquals(result, expectedResult);
});

Deno.test("test_09_TYPE_3_Validation_LastErrorEmptyStringAfterInValidConstruction", () => {
  // Arrange
  const myList = new ShoppingList("");
  const expectedResult = "empty name given";

  // Act
  const result = myList.getLastError();

  // Assert
  assertEquals(result, expectedResult);
});

Deno.test("test_10_TYPE_3_Validation_LastErrorEmptyStringAfterEmptySetName", () => {
  // Arrange
  const myList = new ShoppingList("party");
  const expectedResult = "empty name given";
  myList.setName("");

  // Act
  const result = myList.getLastError();

  // Assert
  assertEquals(result, expectedResult);
});

Deno.test("test_11_TYPE_3_Validation_FalseWhenSubmitEmptyName", () => {
  // Arrange
  const myList = new ShoppingList("party");

  // Act
  const result = myList.setName("");

  // Assert
  assertFalse(result);
});

Deno.test("test_12_TYPE_3_Validation_EmptyItemNameLastErrorAfterAddToListWithEmptyString", () => {
  // Arrange
  const myList = new ShoppingList("party");
  const expectedResult = "empty item name";
  myList.addToList("");

  // Act
  const result = myList.getLastError();

  // Assert
  assertEquals(result, expectedResult);
});
