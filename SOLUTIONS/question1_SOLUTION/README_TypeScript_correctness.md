# TypeScript correctness

There are several steps to getting your code correct. Each one has a `deno task` (defined in `deno.json`) that you
can run yourself before you submit - and a button in the Celbridge console with the same number (①–④).

| Step | Command | What it does |
|---|---|---|
| (1) Type checking | `deno task check` | reports type errors |
| (2) Check formatting | `deno task fmtcheck` | reports layout problems (changes nothing) |
| (3) Fix formatting | `deno task fixsrc` | fixes all layout problems for you |
| (4) Linting | `deno task lint` | reports likely mistakes and bad habits (you fix these) |


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
For an enum property, pick one of its values (e.g. `FuelType.PETROL`) — if the UML diagram shows a default
(e.g. `fuel: FuelType = PETROL`), use that one.

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
public getNumDoors() {
  return this.numDoors;
}

// fixed
public getNumDoors(): number {
  return this.numDoors;
}
```

(use `: void` for a method that returns nothing, e.g. a setter).
