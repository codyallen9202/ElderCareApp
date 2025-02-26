import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import HelpButton from '@/components/HelpButton';
import Calendar from '@/components/DisplaySchedule';
import { EventsProvider } from '@/components/DisplayEvents';

const helpText = `This page displays your full schedule for the day. All appointments, reminders, and important events will be listed here in a scrollable view. Check this page daily to stay on top of your activities.`;

const CalendarScreen = ({ }) => {
  const [currentDate] = useState(new Date());
  const [daysList, setDaysList] = useState([...Array(30).keys()]); 
  const [, setDayRange] = useState([0, 29]); // Load in 30 days of a time

  const handleAddEvent = () => {
    console.log("Add event button clicked!");
    // You can add logic to open a modal or navigate to another screen to add the event.
  };
  

  // Everytime the user gets to the end the the list of 30 days,
  // append 30 days so it's an infinitely scrollable list
  // Learned more about: https://stackoverflow.com/questions/70721232/loading-more-data-onendreached-in-a-react-native-flatlist-is-scrolling-to-top-of
  const loadNextDays = () => {
    setDaysList(prevList => [
      ...prevList, ...[...Array(30).keys()].map(i => i + prevList.length)
    ]);
    setDayRange(previousDays => [previousDays[1] + 1, previousDays[1] + 30]); 
  };

  return (
    <EventsProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text}>Schedule</Text>

          <TouchableOpacity onPress={handleAddEvent} style={styles.addEventButton}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>

          <HelpButton input={helpText} />
        </View>

        {/* Flatlist for vertial (infinite) scrolling: https://reactnative.dev/docs/flatlist#horizontal */}
        <FlatList
          data={daysList} 
          renderItem={({ item }) => (
            <Calendar currentDate={currentDate} dayOffset={item} />
          )}
          keyExtractor={(item, index) => String(index)}
          onEndReached={loadNextDays} 
          // Load more days when user is 30% down the current list: https://stackoverflow.com/questions/39366356/what-onendreachedthreshold-really-means-in-react-native
          onEndReachedThreshold={0.3} 
        />
      </View>
    </EventsProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addEventButton:{
    padding: 10,
    backgroundColor: '#ffee8c',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height:60,
  },
  buttonText:{
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default CalendarScreen;