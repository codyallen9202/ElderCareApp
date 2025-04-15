// // How we are styling the calendar events that we load onto the calendar
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { format, addDays, isToday } from 'date-fns';
import { getEvents, deleteEvent } from './DisplayEvents';
import * as SecureStore from 'expo-secure-store';

const Calendar = ({ currentDate, dayOffset }) => {
  const { events, setEvents } = getEvents(); 
  const [userID, setUserID] = useState<string | null>(null);

  // Load user ID once
  useEffect(() => {
    SecureStore.getItemAsync('user_id').then(id => setUserID(id));
  }, []);

  const date = addDays(currentDate, dayOffset);
  const formattedDate = format(date, 'yyyy-MM-dd'); 
  const eventsForDay = events.filter(event => event.Date === formattedDate);

  const handleDeleteEvent = (id: string) => {
    if (!userID) return;
    setEvents(prev => prev.filter(event => event.id !== id));
    deleteEvent(id, userID);
  };

  return (
    <View style={[styles.dayContainer, isToday(date) && styles.highlight]}>
      <Text style={styles.dateText}>{format(date, 'MMMM dd, yyyy')}</Text>

      {eventsForDay.length > 0 ? (
        eventsForDay.map((event, index) => (
          <View key={index} style={styles.eventContainer}>
            <View style={styles.eventTextContainer}>
              <Text style={styles.eventTitle}>{event.Time}: {event.Name}</Text>
              <Text>{event.Description}</Text>
            </View>

            <Pressable onPress={() => handleDeleteEvent(event.id)}>
              <Text style={styles.deleteText}>✖</Text>
            </Pressable>
          </View>
        ))
      ) : (
        <Text>No events for this day</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventContainer: {
    backgroundColor: '#DDD5F3', 
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  eventTextContainer: {
    flexShrink: 1,                  
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  highlight: {
    backgroundColor: '##FDFD96',
    borderRadius: 5,
    borderWidth: 2,
  },
  deleteText: {
    fontSize: 30,
    color: '#F44336',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginLeft: 10,
  },
});

export default Calendar;