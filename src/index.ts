import { int, text, boolean } from './columns';
// import { eq } from './conditions';
import { db } from './query';
import { table } from './schema';
// import { InferInsertRow, InferSelectRow, InferUpdateRow, table } from './schema';

// Define a sample table

const User = table("users", {
  id: int(),
  name: text({ nullable: true }),
  isActive: boolean(),
  age: int({ nullable: true }),
});

// --- SELECT example ---
/*
type UserRow = InferSelectRow<typeof User>;
const userRow: UserRow = {
  id: 42,
  name: null,
  isActive: true,
  age: null
}
*/

// --- INSERT example ----
/*
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
*/

// --- UPDATE example ----
/*
type UserUpdate = InferUpdateRow<typeof User>;

const validUpdate: UserUpdate = {
  name: "NewName",
  age: null,
}
*/

// Usage example
/*
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
*/

// testQuery().catch(console.error);
/*
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
*/

// testSQLGeneration().catch(console.error);
/*
async function testWhere() {
  const builder = db
    .select()
    .from(User)
    .where(eq(User.columns.id, 42))
    .where(eq(User.columns.name, "Cove"));

  const sqlInfo = builder.toSQL();
  console.log("Where SQL:", sqlInfo.sql);
  console.log("Where Params:", sqlInfo.params);

  const result = await builder.execute();
  console.log("Result:", result);
}
  */

// testWhere().catch(console.error);

// async function testInsert() {
//   const insert = db
//     .insertInto(User)
//     .values({
//       id: 1,
//       name: null,
//       isActive: true,
//     });
  
//   const sqlInfo = insert.toSQL();
//   console.log("Insert SQL:", sqlInfo.sql);
//   console.log("Insert Params:", sqlInfo.params);

//   const result = await insert.execute();
//   console.log("Insert result:", result);
// }

// testInsert().catch(console.error);

async function testReturning() {
  // full return
  const fullInsert = db
    .insertInto(User)
    .values({
      id: 100,
      name: "Favorite",
      isActive: true,
      age: 25,
    })
    .returning();

  const fullResult = await fullInsert.execute();
  console.log("Full returning result:", fullResult);

  // partial return
  const partialInsert = db
    .insertInto(User)
    .values({
      id: 101,
      name: "Neymar",
      isActive: false,
    })
    .returning([User.columns.id, User.columns.name]);

  const partialResult = await partialInsert.execute();
  console.log("Partial returning result:", partialResult);
}

testReturning().catch(console.error);