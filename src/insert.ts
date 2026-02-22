import { InferInsertRow } from './schema';

type AnyTable = { name: string; columns: Record<string, any> };

export interface InsertBuilder<TTable extends AnyTable> {
  values(data: InferInsertRow<TTable>): this;
  // Later: .returning() for inserted row, .onConflictDoNothing(), etc.
  toSQL(): { sql: string, params: any[] };
  execute(): Promise<{ inserted: number }>; // placeholder for affected rows
}

class InsertBuilderImpl<TTable extends AnyTable> implements InsertBuilder<TTable> {
  private table: TTable;
  private data?: InferInsertRow<TTable>;

  constructor(table: TTable) {
    this.table = table;
  }

  values(data: InferInsertRow<TTable>): this {
    this.data = data;
    return this;
  }

  toSQL(): { sql: string; params: any[]; } {
    if (!this.data) {
      throw new Error("No values provided for insert");
    }

    const columns = Object.keys(this.data);
    const valuesPlaceholders = columns.map((_, i) => `$${i + 1}`).join(", ");
    const sql = `
      INSERT INTO "${this.table.name}"
      (${columns.map(c => `"${c}"`).join(", ")})
      VALUES (${valuesPlaceholders})
    `.trim();

    const params = columns.map(c => this.data![c as keyof typeof this.data]);

    return { sql, params };
  }

  async execute(): Promise<{ inserted: number; }> {
    const { sql, params } = this.toSQL();

    console.log("[InsertBuilder] Generated SQL:", sql);
    console.log("[InsertBuilder] Params:", params);

    return { inserted: 1 };
  }
}

export function createInsertBuilder() {
  return {
    insertInto<T extends AnyTable>(table: T): InsertBuilder<T> {
      return new InsertBuilderImpl(table);
    }
  }
}