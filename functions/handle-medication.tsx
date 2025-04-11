// functions/handle-medications.ts
import { saveInfo } from './gen-user'; // adjust path as needed
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseconfig'; // adjust path as needed

export interface MedicationInput {
  id: string;
  name: string;
  time: string;
  startDate: string;
  daysOfWeek: number[];
}

export async function handleAddMedication(
  med: MedicationInput,
  userId: string | null
): Promise<void> {
  if (!userId) {
    console.error("User ID not found. Cannot save medication.");
    return;
  }

  try {
    console.log("Saving new medication:", med);
    await saveInfo(med, userId, "Medications");
  } catch (error) {
    console.error("Failed to save medication:", error);
  }
}

export async function handleDeleteMedication(
  medId: string,
  userId: string | null
): Promise<void> {
  if (!userId) {
    console.error("User ID not found. Cannot delete medication.");
    return;
  }

  try {
    await deleteDoc(doc(db, 'Users', userId, 'Medications', medId));
  } catch (error) {
    console.error("Error deleting medication:", error);
  }
}
