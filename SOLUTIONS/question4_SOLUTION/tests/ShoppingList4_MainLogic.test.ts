// type 4 tests = TYPE_4_MainLogic

import { assertEquals } from "@std/assert";
import { ShoppingList } from "../src/ShoppingList.ts";

Deno.test("test_13_TYPE_4_MainLogic_ItemAddedToListWhenValidItemName", () => {
  // Arrange
  const myList = new ShoppingList("party");
  myList.addToList("apples");
  const expectedResult = ["bread", "eggs", "milk", "apples"];

  // Act
  const result = myList.getList();

  // Assert
  assertEquals(result, expectedResult);
});
