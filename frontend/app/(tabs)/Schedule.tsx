// This page displays the entire schedule. It also has a modal that allows the user to 
// add an event to the calendar. 
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Platform, TextInput } from 'react-native';
import { BlurView } from 'expo-blur';
import Calendar from '@/components/DisplaySchedule';
import { EventsProvider } from '@/components/DisplayEvents';
import { saveInfo, getUserId} from '@/functions/gen-user';
import NeatDatePicker from 'react-native-neat-date-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import TutorialModeUI from '@/components/TutorialModeUI';

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
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tutorialMode, setTutorialMode] = useState(false);
  const [clickedElements, setClickedElements] = useState({});
  const [buttonExplanation, setButtonExplanation] = useState(null);

  const tutorialStatements = {
    addEvent: "Add a new event to your calendar",
    prevButton: "View the previous 30 days",
    nextButton: "View the next 30 days",
    calendar: "View the events you have inputted to your calendar",
    helpButton: "Click this button to turn on tutorial mode and also to turn it off",
  };

  useEffect(() => {
    async function loadUserId() {
      const id = await getUserId();
      setUserID(id);
    }
    loadUserId();
  }, []);

  const handleAddingEvent = () => {
    setAddModalVisible(true); 
    setShowDatePicker(false);
    setShowTimePicker(false);
  };

  const handleSaveEvent = () => {
    // Save event logic
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

  const cancelChoosingDate = () => {
    setShowDatePicker(false);
  };

  const saveDate = (output) => {
    setShowDatePicker(false);
    setNewEventDate(output.dateString);
  };

  const saveEventTime = (date, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const formattedTime = selectedTime.toLocaleTimeString([], {
        hour: '2-digit', 
        minute: '2-digit'
      });
      setNewEventTime(formattedTime);
    }
    setShowTimePicker(false);
  };

  const toggleTutorialMode = () => {
    setTutorialMode(prevMode => !prevMode);
    setClickedElements({});
    setButtonExplanation(null);
  };

  const handleTutorialButtonClick = (elementId) => {
    if (!tutorialMode) return;

    // Set the current clicked-on button in tutorial mode so that we can show
    // the text that is associated with it
    // Can click and unclick a button this way
    setClickedElements(prev => {
      if (prev[elementId]) {
        return {};
      }
      return { [elementId]: true };
    });

    setButtonExplanation(prev => prev === elementId ? null : elementId);
  };

  const getTutorialStyle = (elementId) => {
    if (!tutorialMode) return {};
    
    // The elements in tutorial mode that we can click on will have a red border. When you cick on it,
    // it will change to a ligher orange color
    return {
      borderWidth: 4,
      borderColor: clickedElements[elementId] ? '#FFC067' : '#FF0000', 
      borderStyle: 'solid',
    };
  };

  return (
    <EventsProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.text}>Schedule</Text>
          <TouchableOpacity 
            onPress={tutorialMode ? () => handleTutorialButtonClick('addEvent') : handleAddingEvent}
            style={[styles.addEventButton, getTutorialStyle('addEvent')]}
          >
          <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={toggleTutorialMode} 
            style={[styles.helpButton, getTutorialStyle('helpButton')]}
          >
            <Text style={styles.helpButtonText}>?</Text>
          </TouchableOpacity>
        </View>

        <TutorialModeUI 
          text={tutorialMode 
            ? tutorialStatements[buttonExplanation] || tutorialStatements.helpButton 
            : null
          }
        />

        <View style={styles.navigation}>
          <TouchableOpacity 
            onPress={tutorialMode ? () => handleTutorialButtonClick('prevButton') : prevDays}
            style={[styles.navButton, getTutorialStyle('prevButton')]}
          >
            <Text style={styles.navButtonText}>Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={tutorialMode ? () => handleTutorialButtonClick('nextButton') : nextDays}
            style={[styles.navButton, getTutorialStyle('nextButton')]}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

        {tutorialMode ? (
          <TouchableOpacity 
            style={[styles.calendarContainer, getTutorialStyle('calendar')]}
            onPress={() => handleTutorialButtonClick('calendar')}
            activeOpacity={0.7}
          >
            <FlatList
              data={daysList}
              renderItem={({ item }) => (
                <Calendar currentDate={currentDate} dayOffset={item} />
              )}
              keyExtractor={(item) => item.toString()}
              scrollEnabled={false}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.calendarContainer}>
            <FlatList
              data={daysList}
              renderItem={({ item }) => (
                <Calendar currentDate={currentDate} dayOffset={item} />
              )}
              keyExtractor={(item) => item.toString()}
              showsVerticalScrollIndicator={true}
              scrollEnabled={true}
            />
          </View>
        )}
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
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{width: '100%'}}>
              <TextInput
                style={styles.input}
                placeholder="Event Date"
                placeholderTextColor="#888"
                value={newEventDate}
                editable={false}
              />
            </TouchableOpacity>
            {/* Learned more about the neat date picker: https://github.com/roto93/react-native-neat-date-picker */}
            {/* Believe the look of this is cleaner and easier to look at for those who are older than the date picker
                from the React Native library */}
            <NeatDatePicker
              isVisible={showDatePicker}
              onCancel={cancelChoosingDate}
              onConfirm={saveDate}
              mode={'single'} 
            />
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={{width: '100%'}}>
              <TextInput
                style={styles.input}
                placeholder="Time of Event"
                placeholderTextColor="#888"
                value={newEventTime}
                editable={false}
              />
            {/*Learned about date/time picker: https://github.com/react-native-datetimepicker/datetimepicker */}
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                testID="timePicker"
                value = {new Date()}
                mode="time"
                is24Hour={false} // It shows just the 12 hour and then AM/PM (may be easier for the elderly to choose)
                display="default"
                onChange={saveEventTime}
              />
            )}
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
    backgroundColor:'#ADD8E6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    marginLeft: 10,
  },
  helpButton: {
    width: 60,
    height: 60,
    backgroundColor: 'transparent',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButtonText: {
    color: '#D1001F',
    fontSize: 48,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
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
    marginBottom: 10,
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
  tutorialStyle: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  tutorialText: {
    color: 'white',
    fontSize: 18,
    lineHeight: 24,
  },
  calendarContainer: {
    flex: 1,
    borderRadius: 10,
    padding: 5,
    overflow: 'hidden', 
  }
});

export default CalendarScreen;