import { ColumnDefinition } from './columns';

// Brand for table objects: (helps narrow later if needed)
type TableBrand = { __brand: "table" };

// The runtime shape of a table definition
// export interface TableDefinition<
//   TName extends string,
//   TColumns extends Record<string, ColumnDefinition>
// > {
//   name: TName;
//   columns: TColumns;
// }

// Factory to create a table
export function table<
  const TName extends string,
  const TColumns extends Record<string, ColumnDefinition>
>(
  name: TName,
  columns: TColumns,
): { name: TName; columns: TColumns } & TableBrand {
  return { name, columns, __brand: "table" } as const; // lock literals
}

export type InferColumnType<C extends ColumnDefinition> =
  C["kind"] extends "int"     ? number :
  C["kind"] extends "text"    ? string :
  C["kind"] extends "boolean" ? boolean :
  never;

// nullable check
export type InferSelectField<C extends ColumnDefinition> =
  C["nullable"] extends true
    ? InferColumnType<C> | null
    : InferColumnType<C>;

// Infer the full row type for SELECT (full fields, nullable respected)
export type InferSelectRow<TTable extends { columns: Record<string, ColumnDefinition> }> = {
  [K in keyof TTable["columns"]]: InferSelectField<TTable["columns"][K]>;
};