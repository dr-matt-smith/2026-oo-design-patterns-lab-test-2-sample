# TypeScript correctness

There are seven steps to getting your code correct. Each one has a `deno task` (defined in `deno.json`) that you
can run yourself before you submit - and a button in the Celbridge console with the same number (①–⑦).

| Step | Command | What it does |
|---|---|---|
| (1) Type checking | `deno task check` | reports type errors |
| (2) Check formatting | `deno task fmtcheck` | reports layout problems (changes nothing) |
| (3) Fix formatting | `deno task fixsrc` | fixes all layout problems for you |
| (4) Linting | `deno task lint` | reports likely mistakes and bad habits (you fix these) |
| (5) JSDoc documentation | `deno task doclint` | reports missing documentation comments |
| (6) Tests | `deno task test` | runs the tests, and writes a report |
| (7) Test coverage | `deno task coverage` | checks the tests run **100%** of your code, and writes a report |

## (1) Default value for every property

Deno type-checks in strict mode, so every property must have a value by the time the object is created.

```typescript
// before fix - missing default empty string value for property: firstName
export class Person {
  public firstName: string;
  public age: number = 0;
  public isStudent: boolean = false;
}
```

If a property is declared without one, `deno check` fails with an error like this:

```
$ deno task check
TS2564 [ERROR]: Property 'firstName' has no initializer and is not definitely assigned in the constructor.
```

The simplest fix (when the class has no constructor) is to give each property a suitable default value
where it is declared:

```typescript
// after fix - default empty string value for property: firstName
export class Person {
  public firstName: string = '';
  public age: number = 0;
  public isStudent: boolean = false;
}
```

Use a "neutral" default that clearly means *not set yet*: `''` for strings, `0` for numbers, `false` for booleans.
For an enum property, pick one of its values (e.g. `SelfDrivingType.CRUISE_CONTROL`) — if the UML diagram shows
a default (e.g. `selfDrivingLevel: SelfDrivingType = CRUISE_CONTROL`), use that one.

A property that the **constructor** always sets (e.g. `-electricRange`, set by `Car(electricRange)`) does not need a
default value - TypeScript can see that it is set by the time the object is created.

Always write the type as well as the value. A property with no type at all, such as `public firstName;`,
fails with a different error: `TS7008 Member 'firstName' implicitly has an 'any' type.`

## (2) Check the formatting (spacing, bracket placements etc.)

The **formatter** (`deno fmt`) checks layout only: indentation (2 spaces), spacing, quotes (`"double"`, not
`'single'`), bracket placement, line length (max 120 characters) and a newline at the end of each file.

To see every formatting problem in `src/` without changing anything:

```
$ deno task fmtcheck
```

Each problem is shown as a before/after of the lines that need changing, ending with a line such as
`error: Found 2 not formatted files in 5 files`.

## (3) Fix the formatting

Formatting problems never need fixing by hand: this command rewrites your files in the correct layout
(it does not change what the code does):

```
$ deno task fixsrc
```

Run it whenever you like - for example, every time before you submit. Then run (2) again: it should report
no problems.

## (4) Pass the linter (likely mistakes and bad habits)

The **linter** (`deno lint`) checks for code that is legal TypeScript, but is poor style or likely to be a bug.
It does not care about layout - that is the formatter's job (see (2) and (3)).

To see every lint problem:

```
$ deno task lint
```

Each problem names the rule that was broken (e.g. `error[prefer-const]`), the file and line, and a hint on
how to fix it, ending with a line such as `Found 2 problems`.

Lint problems **must be fixed by hand** - there is no command that fixes them for you. The two you are most
likely to see are:

- `prefer-const` — a variable declared with `let` is never reassigned, so declare it with `const` instead;
- `explicit-function-return-type` — every function and method must say what type it returns:

```typescript
// lint error: Missing return type on function
public getElectricRange() {
  return this.electricRange;
}

// fixed
public getElectricRange(): number {
  return this.electricRange;
}
```

(use `: void` for a method that returns nothing, e.g. a setter).

## (5) Pass the JS Docs requirement

To run deno JS Doc checking:

```
$ deno task doclint
```

All the following need a JSDoc comment:
- exported class
- exported enum
- exported interface
- every **public** property and method in them (including the methods listed in an interface)

JSDoc comments are:
a comment starting with `/**` placed directly above it. Private members (e.g. `-electricRange`) do not need one.
A missing comment is reported as `error[missing-jsdoc]: exported symbol is missing JSDoc documentation`.

```typescript
/** A person who may be enrolled as a student. */
export class Person {
  /** The person's first name. */
  public firstName: string = '';

  /** Age in whole years. */
  public age: number = 0;

  /**
   * Checks whether the person is an adult.
   * @returns true if the person is 18 or over
   */
  public isAdult(): boolean {
    return this.age >= 18;
  }
}
```

One sentence saying what each thing is or does is enough. `@param` and `@returns` tags are good practice but are
not required to pass the check.

## (6) Pass the tests

If there are tests in `/tests` then your code should pass them all

**Do not change the tests - change your code.** When your work is marked, only your `src/` folder is used: it is
run against the lecturer's own copy of the tests. Editing a file in `tests/` so that it passes will not help.

To run deno tests:

```
$ deno task test
```

This prints the results in the console, and also writes an easy-to-read report to `test_output/index.html`
(open it with the clipboard icon in Celbridge, or in any browser). The report shows how many tests passed and
failed, the details of each failing test, and any type errors (see (1)) and lint warnings (see (4)).

Type errors are listed separately and do **not** stop the tests from running, so fix them even when the tests
pass. When a test fails, read its message: it shows the value that was expected and the value your code actually
produced (in the report, *actual* is red and *expected* is green).

The last test file, `ZMeta.test.ts`, does not test what your code does: it runs the formatting check (2) and
the linter (4) on `src/`, so formatting or lint problems will also show up as failing tests.

## (7) Reach 100% test coverage

**Coverage** measures how much of your code the tests actually run. Step (7) passes only when the tests pass (see
(6)) **and** they run 100% of the lines, functions and branches in `src/`.

```
$ deno task coverage
```

This prints a table of percentages for each file, lists anything the tests never ran, and ends with
`Step 7 passed` or `Step 7 failed`, for example:

```
Not covered by the tests:
  src/Car.ts: never run - lines 21-22; some branches never taken - line 20

Step 7 failed: coverage must be 100% - the tests never run the code above.
Remove it if the UML diagram does not ask for it.
```

It also writes a report to `test_coverage_output/index.html` (open it with the chart icon in Celbridge, or in any
browser). It shows each file's source with every line coloured: **green** - run by the tests, **red** - never
run, **amber** - an `if` (or similar) that the tests only ever took one way.

The tests are written to check exactly what the UML diagram asks for, so code that is never run is usually code
the diagram does **not** ask for - for example, a setter for a property that only has «get», or an extra `if`.
Remove it, rather than changing the tests (see (6)).

A **branch** is one of the ways through an `if`, `? :`, `&&` or `||`. An `if` with no `else` has two branches -
the condition being true, and false - so both must happen during the tests for 100% branch coverage.
