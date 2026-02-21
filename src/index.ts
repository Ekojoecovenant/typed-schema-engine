import { int, text, boolean } from './columns';
import { InferInsertRow, InferSelectRow, InferUpdateRow, table } from './schema';

// Define a sample table
const User = table("users", {
  id: int(),
  name: text({ nullable: true }),
  isActive: boolean(),
  age: int({ nullable: true }),
});

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

// type UserRow = InferSelectRow<typeof User>;
// const userRow: UserRow = {
//   id: 42,
//   name: null,
//   isActive: true,
//   age: null
// }

// Just for runtime check
// console.log(User);
// console.log(userRow);  