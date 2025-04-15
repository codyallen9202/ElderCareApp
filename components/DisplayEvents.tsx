import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseconfig'; // Adjust path as needed
import * as SecureStore from 'expo-secure-store';

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const getEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("getEvents must be used within an EventsProvider");
  }
  return context;
};

export async function deleteEvent(eventId: string, userId: string) {
  try {
    const eventDoc = doc(db, "Users", userId, "CalendarEvents", eventId);
    await deleteDoc(eventDoc);
  } catch (error) {
    console.error("Error deleting event:", error);
  }
}

interface EventsProviderProps {
  children: ReactNode;
}

interface EventType {
  id: string;
  Name: string;
  Description: string;
  Date: string;
  Time: string;
}

interface EventsContextType {
  events: EventType[];
  setEvents: React.Dispatch<React.SetStateAction<EventType[]>>;
  deleteEvent: (name: string, date: string, time: string) => Promise<void>;
}

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<EventType[]>([]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function subscribeToEvents() {
      const userId = await SecureStore.getItemAsync('user_id');
      if (!userId) return;

      const eventsRef = collection(db, "Users", userId, "CalendarEvents");
      unsubscribe = onSnapshot(eventsRef, (snapshot) => {
        const fetchedEvents: EventType[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            Name: data.Name || "Untitled Event",
            Description: data.Description || "No description",
            Date: data.Date || "Unknown Date",
            Time: data.Time || "Unknown Time",
          };
        });
        setEvents(fetchedEvents);
      }, error => {
        console.error("Error listening to events:", error);
      });
    }

    subscribeToEvents();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
      {children}
    </EventsContext.Provider>
  );
};
