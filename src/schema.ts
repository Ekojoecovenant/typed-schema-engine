import { ColumnDefinition, ColumnKind } from './columns';
import { AnyTable } from './insert';

// Brand for table objects: (helps narrow later if needed)
// type TableBrand = { __brand: "table" };

// Factory to create a table
export function table<
  const TName extends string,
  const TColumns extends Record<string, ColumnDefinition>,
  const TRelations extends Relations = {}
>(
  name: TName,
  columns: TColumns,
  relations: TRelations = {} as TRelations
): TableDefinition<TName, TColumns, TRelations> {
  return {
    name,
    columns,
    relations,
  } as const;
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


// ============================================ //
// ======== TYPES + HELPERS FOR RELATION ======= // 
// ============================================ //

// relation kinds
export type RelationType = "hasMany" | "belongsTo" | "hasOne";

// relation shape
export type Relation<TTarget extends AnyTable = AnyTable> = {
  type: RelationType;
  targetTable: TTarget;
  foreignKey: string; // field on source table (for belongsTo) or target table (for hasMany)
  localKey?: string; // field on source table (defaults to "id")
  targetKey?: string; // field on target table (defaults to "id")
};

// Relations map
export type Relations = Record<string, Relation>;

// extends tabledefinition to carry relations
export interface TableDefinition<
  TName extends string,
  TColumns extends Record<string, ColumnDefinition>,
  TRelations extends Relations = {}
> {
  name: TName;
  columns: TColumns;
  relations: TRelations;
}

// Infer SELECT with RELATIONS shape
export type InferSelectRowWithRelations<
  TTable extends TableDefinition<string, any, any>
> = InferSelectRow<TTable> & {
  [R in keyof TTable["relations"]]?: TTable["relations"][R]["type"] extends "hasMany"
    ? InferSelectRow<TTable["relations"][R]["targetTable"]>[]
    : InferSelectRow<TTable["relations"][R]["targetTable"]>
};