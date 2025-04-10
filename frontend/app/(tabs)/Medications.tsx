import React, { useState, useEffect } from 'react';

import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import MedList from '@/components/MedList';
import HeaderDisplay from '@/components/HeaderDisplay';
import PlusButton from '@/components/PlusButton';
import TutorialModeUI from '@/components/TutorialModeUI';
import AddMedicationModal from '@/components/AddMedicationModal';
import { saveInfo } from '@/functions/gen-user';

import { MedicationsProvider } from '../../components/MedicationsProvider';


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
        <AddMedicationModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={(medInfo) => {
            console.log("Saving new medication:", medInfo);
            saveInfo(medInfo, userID, "Medications");
          }}
          userID={userID}
        />
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
