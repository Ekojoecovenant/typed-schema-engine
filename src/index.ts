import { int, text } from './columns';

const id = int(); // { kind: "int", nullable: false }
const name = text({ nullable: true }); // { kind: "text", nullable: true }

console.log("First columns:", id, name);

// type IdCol = typeof id;
// type NameCol = typeof name;