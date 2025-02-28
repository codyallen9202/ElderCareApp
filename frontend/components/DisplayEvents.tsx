// Have the calendar data in here 
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Sharing data between components
const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const getEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("getEvents must be used within an EventsProvider");
  }
  return context;
};

// This was added because I kept getting an error when just trying to use childen belo2
// Learned about this at https://stackoverflow.com/questions/75695037/how-to-use-an-interface-with-props-children-and-other-property-types
interface EventsProviderProps {
  children: ReactNode;
}

// Explicit definition of an event
interface EventType {
  title: string;
  description: string;
  date: string;
  time: string;
}

// Giving context for what the function will call
interface EventsContextType {
  events: EventType[];
  setEvents: React.Dispatch<React.SetStateAction<EventType[]>>;
}

// Am currently using dummy data, but will soon get data from the FireBase
export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<EventType[]>([
    {
      title: 'Lunch',
      description: 'Sandwiches today',
      date: '2025-02-26',
      time: '12:00 PM',
    },
    {
      title: 'Take Medications',
      description: 'Make sure to go to medicine cabinet',
      date: '2025-02-26',
      time: '2:00 PM',
    },
  ]);

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
      {children}
    </EventsContext.Provider>
  );
};