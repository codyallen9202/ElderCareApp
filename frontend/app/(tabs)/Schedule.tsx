// This page displays the entire schedule. It also has a modal that allows the user to 
// add an event to the calendar. 
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Platform, TextInput } from 'react-native';
import { BlurView } from 'expo-blur';
import HelpButton from '@/components/HelpButton';
import Calendar from '@/components/DisplaySchedule';
import { EventsProvider } from '@/components/DisplayEvents';

const helpText = `This page displays your full schedule for the day. All appointments, reminders, and important events will be listed here in a scrollable view. Check this page daily to stay on top of your activities.`;

const CalendarScreen = ({ }) => {
  //const [date, setDate] = useState(new Date())
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');

  const handleAddingEvent = () => {
    setAddModalVisible(true); 
  };

  const handleSaveEvent = () => {
    // Save caregiver logic
    console.log('Saving event', newEventName, newEventDate, newEventTime, newEventDesc);
    if (newEventName.trim() && newEventDate.trim() && newEventTime.trim()) {
      const newEvent = {
        id: Date.now().toString(), //  Unique ID
        name: newEventName,
        date: newEventDate,
        time: newEventTime,
        desc: newEventDesc
      };
      //setCaregivers(prevCaregivers => [...prevCaregivers, newCaregiver]); //  Ensure state updates correctly
      setNewEventName('');
      setNewEventDate('');
      setNewEventTime('');
      setNewEventDesc('');
      setAddModalVisible(false); //  Close modal after saving
    } else if (newEventName.trim() && newEventDate.trim() && newEventTime.trim() && newEventDesc.trim()){
      const newEvent = {
        id: Date.now().toString(), //  Unique ID
        name: newEventName,
        date: newEventDate,
        time: newEventTime,
        desc: newEventDesc
      };
      //setCaregivers(prevCaregivers => [...prevCaregivers, newCaregiver]); //  Ensure state updates correctly
      setNewEventName('');
      setNewEventDate('');
      setNewEventTime('');
      setNewEventDesc('');
      setAddModalVisible(false); //  Close modal after saving
    } else {
      alert("Please enter both name and phone number.");
    }

    setAddModalVisible(false);
  };

  const handleCancel = () => {
    setAddModalVisible(false); 
  };

  const [currentDate] = useState(new Date());
  const [daysList, setDaysList] = useState([...Array(30).keys()]); 
  const [, setDayRange] = useState([0, 29]); // Load in 30 days of a time  

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

          <TouchableOpacity onPress={handleAddingEvent} style={styles.addEventButton}>
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
          onEndReached={loadNextDays}
          // Load more days when user is 30% down the current list: https://stackoverflow.com/questions/39366356/what-onendreachedthreshold-really-means-in-react-native
          onEndReachedThreshold={0.3}
        />
      </View>

      {/* Modal */}
      {/* Used the same code for modal that Chase wrote in app/Caregivers */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalWrapper}>
          {/* Background Blur Effect */}
          {Platform.OS === 'web' ? (
            <View style={styles.modalBackgroundFallback} />
          ) : (
            <BlurView intensity={100} style={styles.modalBackground} />
          )}

          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Event</Text>

            <TextInput
              style={styles.input}
              placeholder="Event Name"
              value={newEventName}
              onChangeText={setNewEventName}
            />
            <TextInput
              style={styles.input}
              placeholder="Event Date"
              value={newEventDate}
              onChangeText={setNewEventDate}
            />
            <TextInput
              style={styles.input}
              placeholder="Time of Event"
              value={newEventTime}
              onChangeText={setNewEventTime}
            />
            <TextInput
              style={styles.input}
              placeholder="Description (optional)"
              value={newEventDesc}
              onChangeText={setNewEventDesc}
              keyboardType="phone-pad"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSaveEvent}>
                <Text style={styles.modalButtonText}>✔ Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleCancel}>
                <Text style={styles.modalButtonText}>✖ Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addEventButton: {
    padding: 10,
    backgroundColor: '#ffee8c',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
  },
  buttonText: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalBackgroundFallback: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(10px)', 
    WebkitBackdropFilter: 'blur(10px)', 
  },
  modalBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    padding: 18,
    fontSize: 22,
    marginBottom: 15,
    backgroundColor: '#F8F8F8',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CalendarScreen;