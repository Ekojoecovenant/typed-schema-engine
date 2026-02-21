import { ColumnDefinition } from './columns'
import { InferSelectRow } from './schema';

// Loose constraint to pass table objects
type AnyTable = {
  name: string
  columns: Record<string, ColumnDefinition>
};

// Builder state: carries table + collects conditions
interface SelectBuilder<TTable extends AnyTable> {
  toSQL(): { sql: string; params: any[] };
  execute(): Promise<InferSelectRow<TTable>[]>;
}

// Internal builder implementation
class SelectBuilderImpl<TTable extends AnyTable> implements SelectBuilder<TTable> {
  private table: TTable;

  constructor(table: TTable) {
    this.table = table;
  }

  toSQL(): { sql: string; params: any[] } {
    // Basic SELECT * FROM
    const sql = `SELECT * FROM "${this.table.name}"`;
    const params: any[] = [];

    return { sql, params };
  }

  async execute(): Promise<InferSelectRow<TTable>[]> {
    const { sql, params } = this.toSQL();

    // Log for visibility
    console.log("[QueryBuilder] Generated SQL:", sql);
    console.log("[QueryBuilder] Params:", params);

    // Placeholder runtime
    return [] as InferSelectRow<TTable>[];
  }
}

// Factory for the select chain
export function createQueryBuilder() {
  return {
    select() {
      return {
        from<T extends AnyTable>(table: T): SelectBuilder<T> {
          return new SelectBuilderImpl(table);
        },
      };
    },
  };
}

// Singleton db instance (like PrismaClient)
export const db = createQueryBuilder();