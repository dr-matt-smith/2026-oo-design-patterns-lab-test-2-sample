// Meta test: checks the code quality of src/ rather than what the code does.
// It runs Deno's formatter (in check mode, so nothing is changed) and linter on src/, and fails if either reports a
// problem. The file name starts with 'Z' so this test runs last.
//
// Running other programs needs permission, which is why the test task is:  deno test --allow-run=deno

import { assertEquals } from "@std/assert";

/** Runs `deno <args>`, and returns its exit code and everything it printed. */
const runDeno = async (args: string[]): Promise<{ code: number; output: string }> => {
  const { code, stdout, stderr } = await new Deno.Command("deno", { args }).output();
  const decoder = new TextDecoder();
  return { code, output: decoder.decode(stdout) + decoder.decode(stderr) };
};

Deno.test("testFormattingDirectorySrc", async () => {
  const { code, output } = await runDeno(["fmt", "--check", "src/"]);
  assertEquals(code, 0, `deno fmt reported problems in src/ (run: deno task fixsrc):\n${output}`);
});

Deno.test("testLintDirectorySrc", async () => {
  const { code, output } = await runDeno(["lint", "src/"]);
  assertEquals(code, 0, `deno lint reported problems in src/:\n${output}`);
});
