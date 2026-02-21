import { int, text, boolean } from './columns';
import { db } from './query';
import { InferInsertRow, InferSelectRow, InferUpdateRow, table } from './schema';

// Define a sample table
const User = table("users", {
  id: int(),
  name: text({ nullable: true }),
  isActive: boolean(),
  age: int({ nullable: true }),
});

// --- SELECT example ---
type UserRow = InferSelectRow<typeof User>;
const userRow: UserRow = {
  id: 42,
  name: null,
  isActive: true,
  age: null
}

// --- INSERT example ----
type UserInsert = InferInsertRow<typeof User>;

const validInsert: UserInsert = {
  id: 1,
  isActive: true
}

const validWithNull: UserInsert = {
  id: 2,
  name: null,
  isActive: false,
  age: 25,
}

// --- UPDATE example ----
type UserUpdate = InferUpdateRow<typeof User>;

const validUpdate: UserUpdate = {
  name: "NewName",
  age: null,
}

// Usage example
async function testQuery() {
  const result = await db.select().from(User).execute();

  // result is InferSelectRow<typeof User>[] - Promise<UserRow[]>
  console.log("Query result:", result);

  // Type-safe access
  if (result.length > 0) {
    const first = result[0];
    // first.name -> string | null
    // first.id -> number
    if (first)
      console.log(first.name?.toUpperCase());
  }
}

// testQuery().catch(console.error);

async function testSQLGeneration() {
  const builder = db.select().from(User);

  const sqlInfo = builder.toSQL();
  console.log("Manual toSQL check:");
  console.log(sqlInfo.sql);
  console.log(sqlInfo.params);

  // Log SQL
  const result = await builder.execute();
  console.log("Executed result (placeholder):", result);
}

testSQLGeneration().catch(console.error);