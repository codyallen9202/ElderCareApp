import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import MedList from '@/components/MedList';
import HelpButton from '@/components/HelpButton';
import DateDisplay from '@/components/DateDisplay';
import AddMedicationButton from '@/components/AddMedicationButton';
import { saveInfo, getUserId, deleteCaretaker } from '@/functions/gen-user';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseconfig";

export default function MedicationsPage() {

  // Modal state and input fields for new medication
  const [modalVisible, setModalVisible] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedTime, setNewMedTime] = useState('');
  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserId() {
      const id = await getUserId();
      setUserID(id);
    }
    loadUserId();
  }, []);

  // Open the modal when the plus button is pressed
  const handleAddMedication = () => {
    setModalVisible(true);
  };

  // Save the medication and close the modal
  const handleSaveMedication = () => {
    if (newMedName.trim() && newMedTime.trim()) {
      const medInfo = {
        id: Date.now().toString(),
        name: newMedName,
        time: newMedTime
      }
      console.log("Saving new medication:", { name: newMedName, time: newMedTime });
      // Add your logic to update the medications list or backend here
      saveInfo(medInfo, userID!, "Medications")

      // Reset inputs and close modal
      setNewMedName('');
      setNewMedTime('');
      setModalVisible(false);
    } else {
      alert("Please enter both medication name and time.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <DateDisplay />
        <View style={styles.helpButton}>
          <HelpButton input="This page lists all of the medications you need to take today. When you've taken a medication, tap it, and it will turn gray." />
        </View>
        <View style={styles.addButton}>
          {/* Pass the modal opening function to the plus button */}
          <AddMedicationButton onPress={handleAddMedication} />
        </View>
      </View>
      <View style={styles.medListContainer}>
        <MedList />
      </View>

      {/* Modal for adding a new medication */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalWrapper}>
          {Platform.OS === 'web' ? (
            <View style={styles.modalBackgroundFallback} />
          ) : (
            <BlurView intensity={50} style={styles.modalBackground} />
          )}
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Medication</Text>
            <TextInput
              style={styles.input}
              placeholder="Medication Name"
              placeholderTextColor="#888"
              value={newMedName}
              onChangeText={setNewMedName}
            />
            <TextInput
              style={styles.input}
              placeholder="Time (e.g., 08:00 AM)"
              placeholderTextColor="#888"
              value={newMedTime}
              onChangeText={setNewMedTime}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSaveMedication}>
                <Text style={styles.modalButtonText}>✔ Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>✖ Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    top: 10,
    left: 10,
  },
  addButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  medListContainer: {
    width: '100%',
    height: '100%',
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
