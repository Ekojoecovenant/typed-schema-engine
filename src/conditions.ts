import { ColumnDefinition } from './columns';
import { InferKind } from './schema';

// operators
export type Operator =
  | "="
  | ">"
  | "<"
  | ">="
  | "<="
  | "LIKE"
  | "IN";

// Simple condition representation
export type Condition = {
  field: string;
  operator: Operator;
  value: any;
}

// generic helper for binary operators
function createBinaryCondition<Op extends Operator>(
  operator: Op
) {
  return <
    C extends ColumnDefinition<string, any, any>
  >(
    column: C,
    value: InferKind<C["kind"]>
  ): Condition => ({
    field: column.key ?? "unknown",
    operator,
    value,
  });
}

// Helpers
export const eq = createBinaryCondition("=");
export const gt = createBinaryCondition(">");
export const lt = createBinaryCondition("<");
export const gte = createBinaryCondition(">=");
export const lte = createBinaryCondition("<=");
export const like = createBinaryCondition("LIKE");

// Special: IN (value in arry)
export function inArray<
  C extends ColumnDefinition<string, any, any>
>(
  column: C,
  values: InferKind<C["kind"]>[]
): Condition {
  return {
    field: column.key ?? "unknown",
    operator: "IN",
    value: values,
  };
}

// Typed eq helper - generic over table & key
// export function eq<
//   C extends ColumnDefinition<string, any, any>
// >(
//   column: C, // literal key like "id"
//   value: InferKind<C["kind"]> // matches column type
// ): Condition {
//   return {
//     field: column.key ?? "unknown", // runtime string for SQL
//     operator: "=",
//     value,
//   }
// }