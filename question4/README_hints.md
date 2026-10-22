
# How a test tells you what to write

```typescript
// (1) file name and class name
import { HighScoreTable } from "../src/HighScoreTable.ts"; 

Deno.test("test_02_TYPE_1_ConGetSet_DefaultNamesAfterConstruction", () => {
  // Arrange

   // (2) constructor: no arguments
  const hst = new HighScoreTable();                         
  const expectedResult = ["Adam", "Ben", "Colin", "Dave", "Edmund"];

  // Act

  // (3) a public method: getNames()
  const result = hst.getNames();                            

  // Assert

  // (4) ...which returns string[]
  assertEquals(result, expectedResult);                     
});
```

(an example from a previous test)

1. the **import** names the file to create in `src/`, and the **exported class** in it
2. `new` shows whether the **constructor** takes any parameters, and their types
3. each method called on the object must be **public**
4. the expected result tells you the **return type**, and the **default values** of properties

# One set of tests at a time

- `deno task test` runs **every** file in `tests/` whose name ends `.test.ts`
- To focus on one set, run just that file, e.g.

```bash
deno test tests/HighScoreTable1_ConstructGetSet.test.ts
```

(or move the other test classes out of `/tests`)

- Read the **name** of each test - it says what is being tested
- e.g. until `src/HighScoreTable.ts` exists, the tests fail with *Cannot find module ... src/HighScoreTable.ts* - that is expected

<style scoped>
section { font-size: 22px; }
</style>

# The deno tasks (see deno.json)

| Task | What it does | Question |
| --- | --- | --- |
| `deno task test` | runs all the tests | 1, 2, 3 |
| `deno task reportfixsrc` | reports formatting and lint problems in `src/` | 2 |
| `deno task fixsrc` | fixes the formatting of `src/` | 2 |

The console at the bottom has a shortcut button for each one.
