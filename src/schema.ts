import { ColumnDefinition } from './columns';

// Brand for table objects: (helps narrow later if needed)
type TableBrand = { __brand: "table" };

// The runtime shape of a table definition
export interface TableDefinition<
  TName extends string,
  TColumns extends Record<string, ColumnDefinition>
> {
  name: TName;
  columns: TColumns;
}

// Factory to create a table
export function table<
  TName extends string,
  TColumns extends Record<string, ColumnDefinition>
>(
  name: TName,
  columns: TColumns,
): TableDefinition<TName, TColumns> & TableBrand {
  return {
    name,
    columns,
    __brand: "table"
  } as const; // lock literals
}

// Infer the runtime type of a single column
// export type InferColumnType<C extends ColumnDefinition> =
// C["kind"] extends "int" ? C["nullable"] :
// C["kind"] extends "text" ? C["nullable"] :
// C["kind"] extends "boolean" ? C["nullable"]:
// never;

export type InferColumnType<C extends ColumnDefinition> =
  C["kind"] extends "int" ? number :
  C["kind"] extends "text" ? string :
  C["kind"] extends "boolean" ? boolean :
  never;

// nullable check
export type InferSelectField<C extends ColumnDefinition> =
  C extends { nullable: true }
    ? InferColumnType<C> | null
    : InferColumnType<C>;

// Infer the full row type for SELECT (full fields, nullable respected)
export type InferSelectRow<TTable extends TableDefinition<any, any>> = {
  [K in keyof TTable["columns"]]: InferSelectField<TTable["columns"][K]>;
};