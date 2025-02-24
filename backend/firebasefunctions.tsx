import { db } from "./firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export async function fetchCollectionData(collection_name: string) {
  try {
    const querySnapshot = await getDocs(collection(db, collection_name));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
}

export async function addNewDocument(collection_name: string, data: any) {
    try {
      const docRef = await addDoc(collection(db, "yourCollectionName"), data);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }