// This page displays the entire schedule. It also has a modal that allows the user to 
// add an event to the calendar. 

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, Platform, TextInput
} from 'react-native';
import { BlurView } from 'expo-blur';
import Calendar from '@/components/DisplaySchedule';
import { EventsProvider } from '@/components/DisplayEvents';
import { saveInfo, getUserId } from '@/functions/gen-user';
import NeatDatePicker from 'react-native-neat-date-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import TutorialModeUI from '@/components/TutorialModeUI';
import PlusButton from '@/components/PlusButton';
import HeaderDisplay from '@/components/HeaderDisplay';

export default function Schedule() {
  // Event modal and form state
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [event, setEvent] = useState({ name: '', date: '', time: '', desc: '' });

  // User and calendar state
  const [userID, setUserID] = useState(null);
  const [startDay, setStartDay] = useState(0);
  const [daysList, setDaysList] = useState([...Array(30).keys()]);

  // Date/time picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Tutorial mode state
  const [tutorialMode, setTutorialMode] = useState(false);
  const [clickedElements, setClickedElements] = useState({});
  const [buttonExplanation, setButtonExplanation] = useState(null);

  // Statements for tutorial guidance
  const tutorialStatements = {
    addEvent: 'Add a new event to your calendar',
    prevButton: 'View the previous 30 days',
    nextButton: 'View the next 30 days',
    calendar: 'View the events you have inputted to your calendar',
    helpButton: 'Click this button to turn on tutorial mode and also to turn it off',
  };

  // Fetch user ID on mount
  useEffect(() => {
    getUserId().then(setUserID);
  }, []);

  // Handle form field updates
  const updateEvent = (key, value) => setEvent(prev => ({ ...prev, [key]: value }));

  // Validate and save event
  const handleSaveEvent = () => {
    const { name, date, time, desc } = event;
    if (name.trim() && date.trim() && time.trim()) {
      const newEvent = {
        id: Date.now().toString(),
        Name: name,
        Date: date,
        Time: time,
        Description: desc,
      };
      saveInfo(newEvent, userID, 'CalendarEvents');
      setEvent({ name: '', date: '', time: '', desc: '' });
      setAddModalVisible(false);
    } else {
      alert('Please enter a name, date, and time.');
    }
  };

  // Shift visible days range
  const updateDays = (dir) => {
    const newStart = Math.max(startDay + (dir * 30), 0);
    setStartDay(newStart);
    setDaysList([...Array(30).keys()].map(i => i + newStart));
  };

  // Toggle tutorial mode and reset highlights
  const toggleTutorialMode = () => {
    setTutorialMode(prev => !prev);
    setClickedElements({});
    setButtonExplanation(null);
  };

  // Handle interaction with tutorial-highlighted UI
  const handleTutorialClick = (id) => {
    if (!tutorialMode) return;
    setClickedElements(prev => (prev[id] ? {} : { [id]: true }));
    setButtonExplanation(prev => (prev === id ? null : id));
  };

  // Conditionally apply tutorial highlighting
  const getTutorialStyle = (id) =>
    tutorialMode ? {
      borderWidth: 4,
      borderColor: clickedElements[id] ? '#FFC067' : '#FF0000',
      borderStyle: 'solid',
    } : {};

  // Generate calendar view list
  const CalendarList = (
    <FlatList
      data={daysList}
      renderItem={({ item }) => <Calendar currentDate={new Date()} dayOffset={item} />}
      keyExtractor={(item) => item.toString()}
      scrollEnabled={!tutorialMode}
      showsVerticalScrollIndicator={!tutorialMode}
    />
  );

  return (
    <EventsProvider>
      <View style={styles.container}>
        {/* Header with buttons */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={toggleTutorialMode}
            style={[styles.helpButton, getTutorialStyle('helpButton')]}
          >
            <Text style={styles.helpButtonText}>?</Text>
          </TouchableOpacity>

          <HeaderDisplay pageTitle={'Schedule'} />

        </View>

        {/* Tutorial text overlay */}
        <TutorialModeUI
          text={tutorialMode ? tutorialStatements[buttonExplanation] || tutorialStatements.helpButton : null}
        />

        {/* Navigation controls */}
        <View style={styles.navigation}>
          <TouchableOpacity
            onPress={tutorialMode ? () => handleTutorialClick('prevButton') : () => updateDays(-1)}
            style={[styles.navButton, getTutorialStyle('prevButton')]}
          >
            <Text style={styles.navButtonText}>Prev</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={tutorialMode ? () => handleTutorialClick('nextButton') : () => updateDays(1)}
            style={[styles.navButton, getTutorialStyle('nextButton')]}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar list container */}
        {tutorialMode ? (
          <TouchableOpacity
            style={[styles.calendarContainer, getTutorialStyle('calendar')]}
            onPress={() => handleTutorialClick('calendar')}
            activeOpacity={0.7}
          >
            {CalendarList}
            <View style={styles.plusButton}>
              <PlusButton onPress={tutorialMode ? () => handleTutorialClick('addEvent') : () => setAddModalVisible(true)} />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.calendarContainer}>
            {CalendarList}
            <View style={styles.plusButton}>
              <PlusButton onPress={tutorialMode ? () => handleTutorialClick('addEvent') : () => setAddModalVisible(true)} />
            </View>
          </View>

        )}
      </View>

      {/* Modal for adding a new calendar event */}
      <Modal
        animationType="slide"
        transparent
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalWrapper}>
          {/* Background blur based on platform */}
          {Platform.OS === 'web'
            ? <View style={styles.modalBackgroundFallback} />
            : <BlurView intensity={100} style={styles.modalBackground} />
          }

          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Event</Text>

            <TextInput
              style={styles.input}
              placeholder="Event Name"
              placeholderTextColor="#888"
              value={event.name}
              onChangeText={(text) => updateEvent('name', text)}
            />

            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ width: '100%' }}>
              <TextInput
                style={styles.input}
                placeholder="Event Date"
                placeholderTextColor="#888"
                value={event.date}
                editable={false}
              />
            </TouchableOpacity>

            <NeatDatePicker
              isVisible={showDatePicker}
              onCancel={() => setShowDatePicker(false)}
              onConfirm={(out) => updateEvent('date', out.dateString)}
              mode={'single'}
            />

            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={{ width: '100%' }}>
              <TextInput
                style={styles.input}
                placeholder="Time of Event"
                placeholderTextColor="#888"
                value={event.time}
                editable={false}
              />
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(_, selectedTime) => {
                  if (selectedTime) {
                    const timeStr = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    updateEvent('time', timeStr);
                  }
                  setShowTimePicker(false);
                }}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Description (optional)"
              placeholderTextColor="#888"
              value={event.desc}
              onChangeText={(text) => updateEvent('desc', text)}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSaveEvent}>
                <Text style={styles.modalButtonText}>✔ Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setAddModalVisible(false)}
              >
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  helpButton: {
    position: 'absolute',
    left: 0,
    width: 60,
    height: 60,
    backgroundColor: '#6F91FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  helpButtonText: {
    color: '#FFF',
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
    padding: 10,
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
    padding: 15,
    paddingTop: 0,
    overflow: 'hidden',
  },
  plusButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  }
});