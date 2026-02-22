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
  C extends ColumnDefinition<string, any, any>
>(
  column: C, // literal key like "id"
  value: InferKind<C["kind"]> // matches column type
): Condition {
  return {
    field: column.key, // runtime string for SQL
    operator: "=",
    value,
  }
}