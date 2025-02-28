import React, { useState } from 'react';
import { BlurView } from 'expo-blur';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Image,
  Linking,
  Platform,
} from 'react-native';
import HelpButton from '@/components/HelpButton';
import { sendSMSBlast } from '@/components/smsBlast';


const helpText = `This page displays a list of trusted caregivers who can assist you.
You can view their name and phone number. Tap on "Add Caregiver" to create a new caregiver entry,
or press "Alert All" to notify everyone at once.`;

export default function CaregiversList() {
  //  **Restore default caregivers list**
  const [caregivers, setCaregivers] = useState([
    { id: '1', name: 'Cody Allen', phone: '865-712-2138' },
    // { id: '2', name: 'Caregiver Two', phone: '987-654-3210' },
  ]);

  //  **Ensure "Add Caregiver" modal opens & closes properly**
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newCaregiverName, setNewCaregiverName] = useState('');
  const [newCaregiverPhone, setNewCaregiverPhone] = useState('');


  const handleAddCaregiver = () => {
    setAddModalVisible(true);
  };

  //  **Save new caregiver & update list**
  const handleSaveCaregiver = () => {
    if (newCaregiverName.trim() && newCaregiverPhone.trim()) {
      const newCaregiver = {
        id: Date.now().toString(), //  Unique ID
        name: newCaregiverName,
        phone: newCaregiverPhone,
      };
      setCaregivers(prevCaregivers => [...prevCaregivers, newCaregiver]); //  Ensure state updates correctly
      setNewCaregiverName('');
      setNewCaregiverPhone('');
      setAddModalVisible(false); //  Close modal after saving
    } else {
      alert("Please enter both name and phone number.");
    }
  };

  const handleDeleteCaregiver = (caregiverId: string) => {
    setCaregivers(prevCaregivers =>
      prevCaregivers.filter(item => item.id !== caregiverId)
    );
  };

  // **SMS Alert to all caregivers**


  const renderCaregiver = ({ item }: any) => (
    <View style={styles.caregiver}>
      <View style={styles.caregiverInfo}>
        <Text style={styles.caregiverName}>{item.name}</Text>
        <Text style={styles.caregiverPhone}>Phone: {item.phone}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteCaregiver(item.id)}>
        <Image source={require('../../assets/remove.png')} style={styles.deleteIcon} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <HelpButton input={helpText} />
      <Text style={styles.title}>Caregivers List</Text>

      {/*  **Ensure caregivers list is properly displayed** */}
      <FlatList
        data={caregivers}
        renderItem={renderCaregiver}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No caregivers added yet.</Text>}
      />

      {/*  **Button to open "Add Caregiver" modal** */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddCaregiver}>
        <Text style={styles.addButtonText}>Add Caregiver</Text>
      </TouchableOpacity>

      {/*  **Alert All Button** */}
      <TouchableOpacity style={styles.alertButton} onPress={() => sendSMSBlast([...caregivers])}>
        <Text style={styles.alertButtonText}>Alert All</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalWrapper}>
          {/* Background Blur Effect */}
          {Platform.OS === 'web' ? (
            <View style={styles.modalBackgroundFallback} />
          ) : (
            <BlurView intensity={50} style={styles.modalBackground} />
          )}

          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Caregiver</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newCaregiverName}
              onChangeText={setNewCaregiverName}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={newCaregiverPhone}
              onChangeText={setNewCaregiverPhone}
              keyboardType="phone-pad"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSaveCaregiver}>
                <Text style={styles.modalButtonText}>✔ Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setAddModalVisible(false)}>
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
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 30,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  list: {
    width: '100%',
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 20,
    color: 'gray',
    marginTop: 20,
  },

  //  Caregiver Item Card Styling
  caregiver: {
    flexDirection: 'row',
    backgroundColor: '#E0BBE4', // Light purple background
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  caregiverInfo: {
    flex: 1,
  },
  caregiverName: {
    fontSize: 28, // Larger text for readability
    fontWeight: 'bold',
    color: '#333',
  },
  caregiverPhone: {
    fontSize: 24,
    color: '#555',
    marginTop: 5,
  },

  deleteButton: {
    padding: 15,
    marginRight: -5,
  },
  deleteIcon: {
    width: 50,
    height: 50,
  },

  // Add & Alert Buttons
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  alertButton: {
    backgroundColor: '#F4BC1C',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    marginBottom: 40,
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 22,
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
    backdropFilter: 'blur(10px)',  // ✅ CSS Blur Effect (Web Only)
    WebkitBackdropFilter: 'blur(10px)',
  },

  // 🔹 Modal Styling
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

