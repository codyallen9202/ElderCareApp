import { addNewDocument, fetchCollectionData } from "./firebasefunctions";
const name = "TestCollection";
console.log(fetchCollectionData(name));
const newStuff = {name: "Bob", age: 7, location: "Knoxville"};
addNewDocument(name, newStuff);