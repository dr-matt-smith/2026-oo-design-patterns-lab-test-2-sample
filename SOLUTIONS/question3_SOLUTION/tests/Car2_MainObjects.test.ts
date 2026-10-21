// type 2 tests = TYPE_2_MainObjects = main.ts creates the object shown in the object diagram
//
// main.ts does not export its objects, so these tests run it (deno run src/main.ts) and check what it prints.
// Running other programs needs permission, which is why the test task is:  deno test --allow-run=deno

import { assertEquals, assertStringIncludes } from "@std/assert";

/** Runs src/main.ts, and returns its exit code and everything it printed. */
const runMain = async (): Promise<{ code: number; output: string }> => {
  const { code, stdout, stderr } = await new Deno.Command("deno", { args: ["run", "src/main.ts"] }).output();
  const decoder = new TextDecoder();
  return { code, output: decoder.decode(stdout) + decoder.decode(stderr) };
};

Deno.test("test_10_TYPE_2_MainObjects_MainRunsWithoutErrors", async () => {
  // Arrange
  const expectedResult = 0;

  // Act
  const { code, output } = await runMain();

  // Assert
  assertEquals(code, expectedResult, `deno run src/main.ts failed:\n${output}`);
});

Deno.test("test_11_TYPE_2_MainObjects_AudiA8HasDiagramValues", async () => {
  // Arrange
  const { output } = await runMain();

  // Act
  const result = output.slice(output.indexOf("Car {"));

  // Assert
  assertStringIncludes(result, "priceThousands: 100");
  assertStringIncludes(result, 'selfDrivingLevel: "ADAPTIVE_CRUISE"');
  assertStringIncludes(result, "electricRange: 100");
});
