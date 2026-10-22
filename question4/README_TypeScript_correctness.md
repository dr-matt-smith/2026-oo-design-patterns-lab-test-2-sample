# TypeScript correctness

There are seven steps to getting your code correct. Each one has a `deno task` (defined in `deno.json`) that you
can run yourself before you submit - and a button in the Celbridge console with the same number (①–⑦).

| Step | Command | What it does |
|---|---|---|
| (1) Type checking | `deno task check` | reports type errors |
| (2) Tests | `deno task test` | runs the tests, and writes a report |

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



## (2) Pass the tests

If there are tests in `/tests` then your code should pass them all

**Do not change the tests - change your code.** When your work is marked, only your `src/` folder is used: it is
run against the lecturer's own copy of the tests. Editing a file in `tests/` so that it passes will not help.

To run deno tests:

```
$ deno task test
```

This prints the results in the console, and also writes an easy-to-read report to `test_output/index.html`
(open it with the clipboard icon in Celbridge, or in any browser). The report shows how many tests passed and
failed, the details of each failing test, and any type errors (see (1)) and lint warnings).

Type errors are listed separately and do **not** stop the tests from running, so fix them even when the tests
pass. When a test fails, read its message: it shows the value that was expected and the value your code actually
produced (in the report, *actual* is red and *expected* is green).


