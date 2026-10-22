// type 2 tests = TYPE_2_BasicOperations

import { assertEquals } from "@std/assert";
import { ShoppingList } from "../src/ShoppingList.ts";

Deno.test("test_06_TYPE_2_BasicOperations_ListEmptyAfterAllItemsRemoved", () => {
  // Arrange
  const myList = new ShoppingList("party");
  myList.removeAllItems();
  const expectedResult: string[] = [];

  // Act
  const result = myList.getList();

  // Assert
  assertEquals(result, expectedResult);
});

Deno.test("test_07_TYPE_2_BasicOperations_GetDefaultFirstItem", () => {
  // Arrange
  const myList = new ShoppingList("party");
  const expectedResult = "bread";

  // Act
  const result = myList.getFirstItem();

  // Assert
  assertEquals(result, expectedResult);
});
