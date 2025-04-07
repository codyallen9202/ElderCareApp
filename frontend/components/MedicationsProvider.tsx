// MedicationsProvider.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseconfig'; // Adjust the path as needed
import * as SecureStore from 'expo-secure-store';

export interface MedicationType {
  id: string;
  name: string;
  pillColor: string;
  days: number[]; // e.g. [1, 0, 1, 0, 1, 0, 0]
  time: string;
}

interface MedicationsContextType {
  medications: MedicationType[];
  setMedications: React.Dispatch<React.SetStateAction<MedicationType[]>>;
}

const MedicationsContext = createContext<MedicationsContextType | undefined>(undefined);

export const useMedications = () => {
  const context = useContext(MedicationsContext);
  if (!context) {
    throw new Error("useMedications must be used within a MedicationsProvider");
  }
  return context;
};

interface MedicationsProviderProps {
  children: ReactNode;
}

export const MedicationsProvider: React.FC<MedicationsProviderProps> = ({ children }) => {
  const [medications, setMedications] = useState<MedicationType[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function subscribeToMedications() {
      const userId = await SecureStore.getItemAsync('user_id');
      if (!userId) return;

      // Make sure your Firestore data is organized as Users/{userId}/Medications
      const medsRef = collection(db, "Users", userId, "Medications");
      unsubscribe = onSnapshot(medsRef, (snapshot) => {
        const medsData: MedicationType[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id, // using doc id; adjust if your data uses another id field
            name: data.name || "Unnamed Medication",
            pillColor: data.pillColor || "#000000",
            days: data.days || [0, 0, 0, 0, 0, 0, 0],
            time: data.time || "Unknown Time",
          };
        });
        setMedications(medsData);
      }, error => {
        console.error("Error listening to medications:", error);
      });
    }

    subscribeToMedications();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <MedicationsContext.Provider value={{ medications, setMedications }}>
      {children}
    </MedicationsContext.Provider>
  );
};
