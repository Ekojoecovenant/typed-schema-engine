import { ColumnDefinition, ColumnKind } from './columns';

// Brand for table objects: (helps narrow later if needed)
// type TableBrand = { __brand: "table" };

// Factory to create a table
export function table<
  const TName extends string,
  const TColumns extends Record<string, ColumnDefinition>
>(
  name: TName,
  columns: TColumns,
): { name: TName; columns: TColumns } {
  return { name, columns } as const; // lock literals
}

export type InferKind<K extends ColumnKind> =
  K extends "int"     ? number :
  K extends "text"    ? string :
  K extends "boolean" ? boolean :
  never;

// nullable check
export type InferSelectField<C extends ColumnDefinition> =
  C["nullable"] extends true
    ? InferKind<C["kind"]> | null
    : InferKind<C["kind"]>;

// Infer the full row type for SELECT (full fields, nullable respected)
export type InferSelectRow<T extends { columns: Record<string, ColumnDefinition> }> = {
  [K in keyof T["columns"]]: InferSelectField<T["columns"][K]>;
};