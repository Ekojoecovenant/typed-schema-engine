// First, a based "brand" to make column objects distinct from plain objects
// (helps with type narrowing later)
type ColumnBrand = { __brand: "column" };

// Metadata shape for each column
interface ColumnOptions {
  nullable?: boolean;
  // Later we can add: default?: unknow, primaryKey?: boolean, etc.
}

// The runtime value we'll return (as const so literals stay narrow)
type ColumnDefinition<
  TType extends string,
  TOptions extends ColumnOptions = {}
> = {
  kind: TType;
  nullable: TOptions["nullable"] extends true ? true : false;
} & ColumnBrand;

// Helper to create a column factory
function createColumn<TType extends string>(kind: TType) {
  return function column(opts: ColumnOptions = {}): ColumnDefinition<TType, typeof opts> {
    return {
      kind,
      nullable: opts.nullable ?? false,
    } as const; // crucial locks in literals
  }
}

// Now our typed helpers
export const int = createColumn("int");
export const text = createColumn("text");
export const boolean = createColumn("boolean");
// Add more later: timestamp, json, etc.

// Quick test type
type TestInt = ReturnType<typeof int>;
