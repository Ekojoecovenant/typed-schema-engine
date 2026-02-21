import { ColumnDefinition } from './columns'
import { InferSelectRow } from './schema';

// Loose constraint to pass table objects
type AnyTable = {
  name: string
  columns: Record<string, ColumnDefinition>
};

interface SelectBuilder<TTable extends AnyTable> {
  execute(): Promise<InferSelectRow<TTable>[]>;
}

// Factory for the select chain
export function createQueryBuilder() {
  return {
    select() {
      // Return an object that starts the chain
      return {
        from<T extends AnyTable>(table: T): SelectBuilder<T> {
          // Runtime: placeholder...
          return {
            async execute() {
              console.log(`Pretending to query from table: ${table.name}`);
              // In real version: generate SQL, run query, return rows
              return [] as InferSelectRow<T>[];
            },
          };
        },
      };
    },
  };
}

// Singleton db instance (like PrismaClient)
export const db = createQueryBuilder();