import { int, text, boolean } from './columns';
import { InferSelectRow, table } from './schema';

// Define a sample table
const User = table("users", {
  id: int(),
  name: text({ nullable: true }),
  isActive: boolean(),
  age: int({ nullable: true }),
});

type UserRow = InferSelectRow<typeof User>;
const userRow: UserRow = {
  id: 42,
  name: null,
  isActive: true,
  age: null
}

// Just for runtime check
console.log(User);
console.log(userRow);  