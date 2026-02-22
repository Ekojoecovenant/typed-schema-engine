type ColumnBrand = { __brand: "column" };

// export interface ColumnMetadata {
//   kind: string;
//   nullable: boolean;
// }

// export type ColumnDefinition = ColumnMetadata & ColumnBrand;
export type ColumnKind = "int" | "text" | "boolean";

// Branded type that carries literal kind + nullable
export type ColumnDefinition<
  K extends string = string,
  Kind extends ColumnKind = ColumnKind,
  N extends boolean = boolean
> = {
  readonly kind: Kind;
  readonly nullable: N;
  readonly key: K;
} & ColumnBrand

// Helper to create a literal inference
function createColumn<const Kind extends ColumnKind>(kind: Kind) {
  return <const N extends boolean = false>(
    opts: { nullable?: N } = {}
  ): ColumnDefinition<string, Kind, N> => ({
    kind,
    nullable: (opts.nullable ?? false) as N,
    key: "" as any,
    __brand: "column" as const
  })
  // ({
  //   kind,
  //   nullable: opts.nullable ?? false,
  //   __brand: "column" as const, // optional
  // } as const);
}

// Typed helpers
export const int = createColumn("int");
export const text = createColumn("text");
export const boolean = createColumn("boolean");
// TODO: Add more later: timestamp, json, etc.
