import { InferInsertRow, InferSelectRow } from './schema';

type AnyTable = { name: string; columns: Record<string, any> };

// Interface - public contract for the builder
export interface InsertBuilder<TTable extends AnyTable> {
  values(data: InferInsertRow<TTable>): this;
  returning(fields?: Array<keyof InferSelectRow<TTable>>): this; // optional partial return
  toSQL(): { sql: string, params: any[] };
  execute(): Promise<InferSelectRow<TTable>[] | { inserted: number }>;
}

// Private implementation class
class InsertBuilderImpl<TTable extends AnyTable> implements InsertBuilder<TTable> {
  private table: TTable;
  private data?: InferInsertRow<TTable>;
  private returnFields?: Array<keyof InferSelectRow<TTable>>

  constructor(table: TTable) {
    this.table = table;
  }

  values(data: InferInsertRow<TTable>): this {
    this.data = data;
    return this;
  }

  returning(fields?: Array<keyof InferSelectRow<TTable>>): this {
    this.returnFields = fields; // undefined = return all(*)
    return this;
  }

  // generates the actual SQL string + safe params
  toSQL(): { sql: string; params: any[]; } {
    if (!this.data) {
      throw new Error("No values provided for insert");
    }

    const columns = Object.keys(this.data);
    const valuesPlaceholders = columns.map((_, i) => `$${i + 1}`).join(", ");
    const columnList = columns.map(c => `"${c}"`).join(", ");

    let sql = `
      INSERT INTO "${this.table.name}"
      (${columnList})
      VALUES (${valuesPlaceholders})
    `.trim();

    let returningClause = "RETURNING *";
    if (this.returnFields && this.returnFields.length > 0) {
      returningClause = `RETURNING ${this.returnFields.map(f => `"${String(f)}"`).join(", ")}`;
    }
    sql += ` ${returningClause}`;

    const params = columns.map(c => this.data![c as keyof typeof this.data]);

    return { sql, params };
  }

  // Db call
  async execute(): Promise<InferSelectRow<TTable>[] | { inserted: number }> {
    const { sql, params } = this.toSQL();

    console.log("[InsertBuilder] Generated SQL:", sql);
    console.log("[InsertBuilder] Params:", params);

    if (this.returnFields) {
      const fakeRow: Partial<InferSelectRow<TTable>> = {};
      this.returnFields.forEach(f => {
        fakeRow[f] = this.data![f as keyof typeof this.data];
      });
      return [fakeRow as InferSelectRow<TTable>];
    }

    return [this.data as unknown as InferSelectRow<TTable>];
  }
}

// 6. entry point
export function createInsertBuilder() {
  return {
    insertInto<T extends AnyTable>(table: T): InsertBuilder<T> {
      return new InsertBuilderImpl(table);
    }
  }
}