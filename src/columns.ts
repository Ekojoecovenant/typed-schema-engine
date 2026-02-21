type ColumnBrand = { __brand: "column" };

export interface ColumnMetadata {
  kind: string;
  nullable: boolean;
}

export type ColumnDefinition = ColumnMetadata & ColumnBrand;

// Helper to create a column factory
function createColumn<TKind extends string>(kind: TKind) {
  return (opts: { nullable?: boolean } = {}) =>
  ({
    kind,
    nullable: opts.nullable ?? false,
    __brand: "column" as const, // optional
  } as const);
}

// Typed helpers
export const int = createColumn("int");
export const text = createColumn("text");
export const boolean = createColumn("boolean");
// TODO: Add more later: timestamp, json, etc.
