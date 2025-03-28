// How we are styling the calendar events that we load onto the calendar
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format, addDays, isToday } from 'date-fns';
import { getEvents } from './DisplayEvents'; // To access events for each day


const Calendar = ({ currentDate, dayOffset }) => {
  const { events } = getEvents(); 

  // Getting the days and formatting it
  const date = addDays(currentDate, dayOffset);
  const formattedDate = format(date, 'yyyy-MM-dd'); 

  // Find today's events and then print it out
  const eventsForDay = events.filter(event => event.Date === formattedDate);

  return (
    <View style={[styles.dayContainer, isToday(date) && styles.highlight]}>
      {/* MMMM gives us the month name instead of a number */}
      <Text style={styles.dateText}>{format(date, 'MMMM dd, yyyy')}</Text>
      
      {eventsForDay.length > 0 ? (
        eventsForDay.map((event, index) => (
          <View key={index} style={styles.eventContainer}>
            <Text style={styles.eventTitle}>{event.Time}: {event.Name}</Text>
            <Text>{event.Description}</Text>
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
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  highlight: {
    backgroundColor: '##FDFD96',
    borderRadius: 5,
    borderWidth: 2,
  }
});

export default Calendar;