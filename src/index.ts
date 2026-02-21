import { int, text } from './columns';

const idCol = int(); // { kind: "int", nullable: false }
const nameCol = text({ nullable: true }); // { kind: "text", nullable: true }

console.log("Mommy's first columns:", idCol, nameCol);

type IdType = typeof idCol;