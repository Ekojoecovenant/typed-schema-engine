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
  for (const [key, col] of Object.entries(columns)) {
    (col as any).key = key; // safe case - we know
  }
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

// Infer SELECT (full fields, nullable respected)
export type InferSelectRow<T extends { columns: Record<string, ColumnDefinition> }> = {
  [K in keyof T["columns"]]: InferSelectField<T["columns"][K]>;
};

// Infer INSERT shape:
// - Required fields: non-nullale columns without default
// - Optional fields: nullable columns
export type InferInsertRow<T extends { columns: Record<string, ColumnDefinition> }> = {
  [K in keyof T["columns"] as T["columns"][K]["nullable"] extends true ? never : K]:
    T["columns"][K]["nullable"] extends true
      ? InferKind<T["columns"][K]["kind"]> | null // nullable
      : InferKind<T["columns"][K]["kind"]>; // non-nullable
} & {
  [K in keyof T["columns"] as T["columns"][K]["nullable"] extends true ? K : never]?:
    InferKind<T["columns"][K]["kind"]> | null;
};

// Infer UPDATE shape:
// - Everything optional
// - Set to null only if nullable
export type InferUpdateRow<T extends { columns: Record<string, ColumnDefinition> }> = {
  [K in keyof T["columns"]]?:
    T["columns"][K]["nullable"] extends true
      ? InferKind<T["columns"][K]['kind']> | null
      : InferKind<T["columns"][K]["kind"]>;
};