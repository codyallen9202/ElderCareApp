import React, { useState, useEffect } from 'react';
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
  Platform,
} from 'react-native';
import { sendSMSBlast } from '@/components/smsBlast';
import { saveInfo, getUserId, deleteCaretaker } from '@/functions/gen-user';
import {collection, getDocs} from "firebase/firestore";
import { db } from "../../firebaseconfig";
import TutorialModeUI from '@/components/TutorialModeUI';

export default function CaregiversList() {
    //  **Restore default caregivers list**
  /*
  const [caregivers, setCaregivers] = useState([
    { id: '1', name: 'Cody Allen', phone: '865-712-2138' },
    // { id: '2', name: 'Caregiver Two', phone: '987-654-3210' },
  ]); */
  const [caregivers, setCaregivers] = useState<{ id: string; name: string; phone: string }[]>([]);
  const [userID, setUserID] = useState<string | null>(null);
  const [tutorialMode, setTutorialMode] = useState(false);
  const [clickedElements, setClickedElements] = useState({});
  const [buttonExplanation, setButtonExplanation] = useState(null);

  const tutorialStatements = {
    caregiverList: "View your trusted caregivers here.",
    addCaregiver: "Tap here to add a new caregiver to your list.",
    alertAll: "Tap this button to send an alert to all caregivers.",
    helpButton: "Click this button to turn on tutorial mode and also to turn it off",
  };

  useEffect(() => {
    async function fetchCaregivers() {
      const id = await getUserId();
      setUserID(id);

      if (id) {
        const caretakersRef = collection(db, "Users", id, "Caretakers");
        const snapshot = await getDocs(caretakersRef);
        const caregiversList = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Unknown", // Provide a default name
            phone: data.phone || "N/A" // Provide a default phone number
          };
        });

        setCaregivers(caregiversList);
      }
    }
    fetchCaregivers();
  }, []);
  
  //  **Ensure "Add Caregiver" modal opens & closes properly**
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newCaregiverName, setNewCaregiverName] = useState('');
  const [newCaregiverPhone, setNewCaregiverPhone] = useState('');


  const handleAddCaregiver = () => {
    if (!tutorialMode) 
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
      saveInfo(newCaregiver, userID!, "Caretakers")
    } else {
      alert("Please enter both name and phone number.");
    }
  };

  const handleDeleteCaregiver = (caregiverId: string) => {
    setCaregivers(prevCaregivers =>
      prevCaregivers.filter(item => item.id !== caregiverId)
    );
    deleteCaretaker(caregiverId, userID!);
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

  // Both below are same as the functions in Schedule.tsx
  const handleTutorialClick = (id) => {
    if (!tutorialMode) return;
    setClickedElements(prev => (prev[id] ? {} : { [id]: true }));
    setButtonExplanation(prev => (prev === id ? null : id));
  };

  const getTutorialStyle = (id) => {
    if (!tutorialMode) return {};
    return {
      borderWidth: 4,
      borderColor: clickedElements[id] ? '#FFC067' : '#FF0000',
      borderStyle: 'solid',
    };
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setTutorialMode(prev => !prev)}
        style={[styles.helpButton, getTutorialStyle('helpButton')]}
        onPressIn={() => tutorialMode && handleTutorialClick('helpButton')}
      > 
        <Text style={styles.helpButtonText}>?</Text>
      </TouchableOpacity>
      <View style={styles.header}> 
        <Text style={styles.title}>Caregivers List</Text>
      </View>

      {/* Code for tutorial mode below (similar to schedule page) */}
      <TutorialModeUI
        text={tutorialMode
          ? tutorialStatements[buttonExplanation] || tutorialStatements.helpButton
          : null
        }
      />

      {tutorialMode ? (
        <TouchableOpacity 
          activeOpacity={1}
          onPress={() => handleTutorialClick('caregiverList')}
          style={[styles.tutorialListContainer, getTutorialStyle('caregiverList')]}
        >
          <FlatList
            data={caregivers}
            renderItem={renderCaregiver}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.emptyText}>No caregivers added yet.</Text>}
            scrollEnabled={false}
          />
        </TouchableOpacity>
      ) : (
        <FlatList
          data={caregivers}
          renderItem={renderCaregiver}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No caregivers added yet.</Text>}
          showsVerticalScrollIndicator={true}
        />
      )}

      {/*  **Button to open "Add Caregiver" modal** */}
      <TouchableOpacity
        style={[styles.addButton, getTutorialStyle('addCaregiver')]}
        onPress={() => tutorialMode ? handleTutorialClick('addCaregiver') : handleAddCaregiver()}
      >
        <Text style={styles.addButtonText}>Add Caregiver</Text>
      </TouchableOpacity>

      {/*  **Alert All Button** */}
      <TouchableOpacity
        style={[styles.alertButton, getTutorialStyle('alertAll')]}
        onPress={() => tutorialMode ? handleTutorialClick('alertAll') : sendSMSBlast([...caregivers])}
      >
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
              placeholderTextColor="#888"
              value={newCaregiverName}
              onChangeText={setNewCaregiverName}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor="#888"
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
    paddingTop: 20,
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
  // Makes sure the red box around our caregivers list doesn't get
  // too long, either
  tutorialListContainer: {
    width: '100%',
    maxHeight: '43%',
    alignSelf: 'center',
    overflow: 'hidden'
  }
});