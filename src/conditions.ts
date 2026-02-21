import { ColumnDefinition } from './columns';
import { InferKind } from './schema';

// Simple condition representation
export type Condition = {
  field: string;
  operator: "=" | ">" | "<" | ">=" | "<=";
  value: any;
}

// Typed eq helper - generic over table & key
export function eq<
  TTable extends { columns: Record<string, ColumnDefinition> },
  K extends keyof TTable["columns"]
>(
  table: TTable, // pass the table to infer keys
  field: K, // literal key like "id"
  value: InferKind<TTable["columns"][K]["kind"]> // matches column type
): Condition {
  return {
    field: field as string, // runtime string for SQL
    operator: "=",
    value,
  }
}