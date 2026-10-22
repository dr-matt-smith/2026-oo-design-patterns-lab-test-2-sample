{
  "name": "Hints - Shopping List lab test",
  "description": "How to read the tests, and which deno task to run for each question",
  "navigation": {
    "show": true,
    "style": "arrows",
    "position": "top-right",
    "showNumber": true
  },
  "sequenceArrows": {
    "show": true,
    "style": "dashed",
    "color": "#ffcc00",
    "alpha": 0.75
  },
  "nodes": [
    {
      "name": "Reading a test",
      "x": 240,
      "y": 0,
      "text": "<style scoped>\nsection { font-size: 22px; }\npre { font-size: 18px; }\n</style>\n\n# How a test tells you what to write\n\n```typescript\nimport { HighScoreTable } from \"../src/HighScoreTable.ts\"; // (1) file name and class name\n\nDeno.test(\"test_02_TYPE_1_ConGetSet_DefaultNamesAfterConstruction\", () => {\n  // Arrange\n  const hst = new HighScoreTable();                          // (2) constructor: no arguments\n  const expectedResult = [\"Adam\", \"Ben\", \"Colin\", \"Dave\", \"Edmund\"];\n\n  // Act\n  const result = hst.getNames();                             // (3) a public method: getNames()\n\n  // Assert\n  assertEquals(result, expectedResult);                      // (4) ...which returns string[]\n});\n```\n\n(an example from a previous test)\n\n1. the **import** names the file to create in `src/`, and the **exported class** in it\n2. `new` shows whether the **constructor** takes any parameters, and their types\n3. each method called on the object must be **public**\n4. the expected result tells you the **return type**, and the **default values** of properties\n"
    },
    {
      "name": "One set of tests at a time",
      "x": 480,
      "y": 0,
      "text": "# One set of tests at a time\n\n- `deno task test` runs **every** file in `tests/` whose name ends `.test.ts`\n- To focus on one set, run just that file, e.g.\n\n```bash\ndeno test tests/HighScoreTable1_ConstructGetSet.test.ts\n```\n\n(or move the other test classes out of `/tests`)\n\n- Read the **name** of each test - it says what is being tested\n- e.g. until `src/HighScoreTable.ts` exists, the tests fail with *Cannot find module ... src/HighScoreTable.ts* - that is expected\n"
    },
    {
      "name": "deno tasks",
      "x": 720,
      "y": 0,
      "text": "<style scoped>\nsection { font-size: 22px; }\n</style>\n\n# The deno tasks (see deno.json)\n\n| Task | What it does | Question |\n| --- | --- | --- |\n| `deno task test` | runs all the tests | 1, 2, 3 |\n| `deno task reportfixsrc` | reports formatting and lint problems in `src/` | 2 |\n| `deno task fixsrc` | fixes the formatting of `src/` | 2 |\n\nThe console at the bottom has a shortcut button for each one.\n"
    }
  ]
}
