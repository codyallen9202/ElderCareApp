import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
  Modal, TextInput, Platform
} from 'react-native';
import { BlurView } from 'expo-blur';
import MedList from '@/components/MedList';
import HelpButton from '@/components/HelpButton';
import HeaderDisplay from '@/components/HeaderDisplay';
import { saveInfo } from '@/functions/gen-user';
import { MedicationsProvider } from '../../components/MedicationsProvider';
import PlusButton from '@/components/PlusButton';
import TutorialModeUI from '@/components/TutorialModeUI';
import NeatDatePicker from 'react-native-neat-date-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DayPicker } from 'react-native-picker-weekday'
import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native';

export default function MedicationsPage() {
  // Modal visibility and form inputs
  const [modalVisible, setModalVisible] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedTime, setNewMedTime] = useState('');
  const [newMedStartDate, setNewMedDate] = useState('');
  const [newMedDaysOfWeek, setNewMedDaysOfWeek] = React.useState([-1])
  const [userID, setUserID] = useState(null);

  // Tutorial mode state
  const [tutorialMode, setTutorialMode] = useState(false);
  const [clickedElements, setClickedElements] = useState({});
  const [buttonExplanation, setButtonExplanation] = useState(null);

  // Date/time picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Statements for tutorial guidance
  const tutorialStatements = {
    addMed: 'Add a new medication to your list',
    list: 'View the medications you have to take',
    helpButton: 'Click this button to turn on tutorial mode and also to turn it off',
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

  // Fetch user ID on mount
  useEffect(() => {
    async function loadId() {
      const id = await SecureStore.getItemAsync('user_id');
      setUserID(id);
    }
    loadId();
  }, []);

  // Handle '+' button press to open modal
  const handleAddMedication = () => {
    setModalVisible(true);
    setNewMedDaysOfWeek([-1]);
  }

  // Validate and save new medication entry
  const handleSaveMedication = () => {
    if (!newMedName.trim() || !newMedTime.trim() || !newMedStartDate.trim() || !newMedDaysOfWeek) {
      alert("Please enter medication name, time, start date, days of the week.");
      return;
    }

    const medInfo = {
      id: Date.now().toString(),
      name: newMedName,
      time: newMedTime,
      startDate: newMedStartDate,
      daysOfWeek: newMedDaysOfWeek
    };

    console.log("Saving new medication:", medInfo);
    saveInfo(medInfo, userID, "Medications");

    // Reset inputs and close modal
    setNewMedName('');
    setNewMedTime('');
    setNewMedDate('');
    setNewMedDaysOfWeek([]);
    setModalVisible(false);
  };

  return (
    <MedicationsProvider>
      <SafeAreaView style={styles.container}>
        {/* Header section with date and help */}
        <View style={styles.header}>
          <HeaderDisplay pageTitle={'Medications'} />
          <View style={styles.helpButton}>
            <TouchableOpacity
              onPress={toggleTutorialMode}
              style={[styles.helpButton, getTutorialStyle('helpButton')]}
            >
              <Text style={styles.helpButtonText}>?</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tutorial text overlay */}
        <TutorialModeUI
          text={tutorialMode ? tutorialStatements[buttonExplanation] || tutorialStatements.helpButton : null}
        />

        {/* Medication list display */}
        {tutorialMode ? (
          <TouchableOpacity
            style={[styles.medListContainer, getTutorialStyle('list')]}
            onPress={() => handleTutorialClick('list')}
            activeOpacity={0.7}
          >
            <MedList />
            <View style={styles.addButton}>
              <PlusButton onPress={tutorialMode ? () => handleTutorialClick('addMed') : () => setModalVisible(true)} />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.medListContainer}>
            <MedList />
            <View style={styles.addButton}>
              <PlusButton onPress={tutorialMode ? () => handleTutorialClick('addMed') : () => setModalVisible(true)} />
            </View>
          </View>

        )}

        {/* Add medication modal */}
        <Modal
          animationType="slide"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalWrapper}>
            {/* Background blur effect for native; fallback for web */}
            {Platform.OS === 'web'
              ? <View style={styles.modalBackgroundFallback} />
              : <BlurView intensity={50} style={styles.modalBackground} />
            }

            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Medication</Text>

              {/* Medication Name Input */}
              <TextInput
                style={styles.input}
                placeholder="Medication Name"
                placeholderTextColor="#888"
                value={newMedName}
                onChangeText={setNewMedName}
              />

              {/* Medication Start Date Input using Neat-date-picker */}
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ width: '100%' }}>
                <TextInput
                  style={styles.input}
                  placeholder="Medication's Start Date"
                  placeholderTextColor="#888"
                  value={newMedStartDate}
                  editable={false}
                />
              </TouchableOpacity>

              <NeatDatePicker
                isVisible={showDatePicker}
                onCancel={() => setShowDatePicker(false)}
                onConfirm={(out) => {
                  setNewMedDate(out.dateString);
                  setShowDatePicker(false);
                }}
                mode={'single'}
              />

              {/* Time Input */}
              <TouchableOpacity onPress={() => setShowTimePicker(true)} style={{ width: '100%' }}>
                <TextInput
                  style={styles.input}
                  placeholder="Time of Event"
                  placeholderTextColor="#888"
                  value={newMedTime}
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
                      setNewMedTime(timeStr);
                    }
                    setShowTimePicker(false);
                  }}
                />
              )}

              {/* Choose Days to take the Medication On */}
              <View style={{ width: '100%', marginBottom: 5 }}>
                <Text style={{ fontSize: 18, marginBottom: 1, marginTop: 5 }}>
                  Select Days You Take Medication:
                </Text>

                <DayPicker
                  weekdays={newMedDaysOfWeek}
                  setWeekdays={setNewMedDaysOfWeek}
                  activeColor="violet"
                  textColor="black"
                  inactiveColor="#D3D3D3"
                  wrapperStyles={{
                    justifyContent: 'center',
                    marginTop: 0,
                    paddingTop: 0,
                  }}
                  itemStyles={{
                    marginHorizontal: 2,
                    paddingVertical: 2,
                    borderRadius: 10,
                  }}
                />
              </View>

              {/* Modal action buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={handleSaveMedication}>
                  <Text style={styles.modalButtonText}>✔ Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>✖ Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </MedicationsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F4F4F4',
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
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  medListContainer: {
    flex: 1,
    borderRadius: 10,
    padding: 5,
    overflow: 'hidden',
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalBackgroundFallback: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
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
