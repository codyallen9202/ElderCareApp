// Have the calendar data in here 
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Sharing data between components
const EventsContext = createContext([]);

export const getEvents = () => {
  return useContext(EventsContext);
};

// This was added because I kept getting an error when just trying to use childen belo2
// Learned about this at https://stackoverflow.com/questions/75695037/how-to-use-an-interface-with-props-children-and-other-property-types
interface EventsProviderProps {
  children: ReactNode; 
}

// Am currently using dummy data, but will soon get data from the FireBase
export const EventsProvider: React.FC<EventsProviderProps>  = ({ children }) => {
  const [events, setEvents] = useState([
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