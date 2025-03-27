// This page displays the entire schedule. It also has a modal that allows the user to 
// add an event to the calendar. 
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Platform, TextInput } from 'react-native';
import { BlurView } from 'expo-blur';
import HelpButton from '@/components/HelpButton';
import Calendar from '@/components/DisplaySchedule';
import { EventsProvider } from '@/components/DisplayEvents';
import { saveInfo, getUserId} from '@/functions/gen-user';
import NeatDatePicker from 'react-native-neat-date-picker';

const helpText = `This page displays your full schedule for the day. All appointments, reminders, and important events will be listed here in a scrollable view. Check this page daily to stay on top of your activities.`;

const CalendarScreen = ({ }) => {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [userID, setUserID] = useState<string | null>(null);
  const [currentDate] = useState(new Date());
  const [startDay, setStartDay] = useState(0);
  const [daysList, setDaysList] = useState([...Array(30).keys()]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(''); 

  useEffect(() => {
    async function loadUserId() {
      const id = await getUserId();
      setUserID(id);
    }
    loadUserId();
  }, []);

  const handleAddingEvent = () => {
    setAddModalVisible(true); 
  };

  const handleSaveEvent = () => {
    // Save caregiver logic
    console.log('Saving event', newEventName, newEventDate, newEventTime, newEventDesc);
    if (newEventName.trim() && newEventDate.trim() && newEventTime.trim()) {
      const newEvent = {
        id: Date.now().toString(), //  Unique ID
        Name: newEventName,
        Date: newEventDate,
        Time: newEventTime,
        Description: newEventDesc
      };
      saveInfo(newEvent, userID!, "CalendarEvents");
      //setCaregivers(prevCaregivers => [...prevCaregivers, newCaregiver]); //  Ensure state updates correctly
      setNewEventName('');
      setNewEventDate('');
      setNewEventTime('');
      setNewEventDesc('');
      setAddModalVisible(false); //  Close modal after saving
    } else if (newEventName.trim() && newEventDate.trim() && newEventTime.trim() && newEventDesc.trim()){
      const newEvent = {
        id: Date.now().toString(), //  Unique ID
        Name: newEventName,
        Date: newEventDate,
        Time: newEventTime,
        Description: newEventDesc
      };
      saveInfo(newEvent, userID!, "CalendarEvents");
      //setCaregivers(prevCaregivers => [...prevCaregivers, newCaregiver]); //  Ensure state updates correctly
      setNewEventName('');
      setNewEventDate('');
      setNewEventTime('');
      setNewEventDesc('');
      setAddModalVisible(false); //  Close modal after saving
    } else {
      alert("Please enter a name, date, and time.");
    }

    setAddModalVisible(false);
  };

  const handleCancel = () => {
    setAddModalVisible(false); 
  };

  const nextDays = () => {
    setStartDay(prevStart => prevStart + 30);
    setDaysList([...Array(30).keys()].map(i => i + startDay));
  };

  const prevDays = () => {
    setStartDay(prevStart => Math.max(prevStart - 30, 0)); 
    setDaysList([...Array(30).keys()].map(i => i + startDay));
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const cancelChoosingDate = () => {
    setShowDatePicker(false);
  };

  const saveDate = (output) => {
    setShowDatePicker(false);
    setNewEventDate(output.dateString);
    setSelectedDate(output.dateString)
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

        <View style={styles.navigation}>
          <TouchableOpacity onPress={prevDays} style={styles.navButton}>
            <Text style={styles.navButtonText}>Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={nextDays} style={styles.navButton}>
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={daysList}
          renderItem={({ item }) => (
            <Calendar currentDate={currentDate} dayOffset={item} />
          )}
          keyExtractor={(item) => item.toString()}
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
              placeholderTextColor="#888"
              value={newEventName}
              onChangeText={setNewEventName}
            />
            <TouchableOpacity onPress={openDatePicker} style={{width: '100%'}}>
              <TextInput
                style={styles.input}
                placeholder="Select Date"
                placeholderTextColor="#888"
                value={selectedDate}
                editable={false}
              />
            </TouchableOpacity>
            {/* Learned more about the date picker: https://github.com/roto93/react-native-neat-date-picker */}
            <NeatDatePicker
              isVisible={showDatePicker}
              onCancel={cancelChoosingDate}
              onConfirm={saveDate}
              mode={'single'} 
            />
            <TextInput
              style={styles.input}
              placeholder="Time of Event"
              placeholderTextColor="#888"
              value={newEventTime}
              onChangeText={setNewEventTime}
            />
            <TextInput
              style={styles.input}
              placeholder="Description (optional)"
              placeholderTextColor="#888"
              value={newEventDesc}
              onChangeText={setNewEventDesc}

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
    width: '100%',
  },
  addEventButton: {
    padding: 10,
    backgroundColor: '#ffee8c',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 15,
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
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', 
    marginTop: 10,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15, 
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CalendarScreen;