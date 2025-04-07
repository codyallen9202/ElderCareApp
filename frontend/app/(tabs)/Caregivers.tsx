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
import { saveInfo, deleteCaretaker } from '@/functions/gen-user';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseconfig';
import TutorialModeUI from '@/components/TutorialModeUI';
import HeaderDisplay from '@/components/HeaderDisplay';
import * as SecureStore from 'expo-secure-store';

export default function CaregiversList() {
  const [caregivers, setCaregivers] = useState([]);
  const [userID, setUserID] = useState(null);
  const [tutorialMode, setTutorialMode] = useState(false);
  const [clickedElements, setClickedElements] = useState({});
  const [buttonExplanation, setButtonExplanation] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newCaregiverName, setNewCaregiverName] = useState('');
  const [newCaregiverPhone, setNewCaregiverPhone] = useState('');

  const tutorialStatements = {
    caregiverList: 'View your trusted caregivers here.',
    addCaregiver: 'Tap here to add a new caregiver to your list.',
    alertAll: 'Tap this button to send an alert to all caregivers.',
    helpButton: 'Click this button to turn on tutorial mode and also to turn it off',
  };

  useEffect(() => {
    (async () => {
      const id = await SecureStore.getItemAsync('user_id');
      setUserID(id);
      if (id) {
        const snapshot = await getDocs(collection(db, 'Users', id, 'Caretakers'));
        const caregiversList = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || 'Unknown',
          phone: doc.data().phone || 'N/A',
        }));
        setCaregivers(caregiversList);
      }
    })();
  }, []);

  const handleAddCaregiver = () => !tutorialMode && setAddModalVisible(true);

  const handleSaveCaregiver = () => {
    if (!newCaregiverName.trim() || !newCaregiverPhone.trim()) return alert('Please enter both name and phone number.');
    const newCaregiver = {
      id: Date.now().toString(),
      name: newCaregiverName,
      phone: newCaregiverPhone,
    };
    setCaregivers(prev => [...prev, newCaregiver]);
    saveInfo(newCaregiver, userID, 'Caretakers');
    setNewCaregiverName('');
    setNewCaregiverPhone('');
    setAddModalVisible(false);
  };

  const handleDeleteCaregiver = id => {
    setCaregivers(prev => prev.filter(c => c.id !== id));
    deleteCaretaker(id, userID);
  };

  const handleTutorialClick = id => {
    if (!tutorialMode) return;
    setClickedElements(prev => (prev[id] ? {} : { [id]: true }));
    setButtonExplanation(prev => (prev === id ? null : id));
  };

  const getTutorialStyle = id =>
    tutorialMode
      ? {
        borderWidth: 4,
        borderColor: clickedElements[id] ? '#FFC067' : '#FF0000',
        borderStyle: 'solid',
      }
      : {};

  const renderCaregiver = ({ item }) => (
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

  const caregiverList = (
    <FlatList
      data={caregivers}
      renderItem={renderCaregiver}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.emptyText}>No caregivers added yet.</Text>}
      scrollEnabled={!tutorialMode}
      showsVerticalScrollIndicator={!tutorialMode}
    />
  );

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setTutorialMode(prev => !prev)}
          style={[styles.helpButton, getTutorialStyle('helpButton')]}
          onPressIn={() => handleTutorialClick('helpButton')}
        >
          <Text style={styles.helpButtonText}>?</Text>
        </TouchableOpacity>

        <HeaderDisplay pageTitle={'Contacts'} />
      </View>

      <TutorialModeUI
        text={tutorialMode ? tutorialStatements[buttonExplanation] || tutorialStatements.helpButton : null}
      />

      {tutorialMode ? (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handleTutorialClick('caregiverList')}
          style={[styles.tutorialListContainer, getTutorialStyle('caregiverList')]}
        >
          {caregiverList}
        </TouchableOpacity>
      ) : caregiverList}

      <TouchableOpacity
        style={[styles.addButton, getTutorialStyle('addCaregiver')]}
        onPress={() => (tutorialMode ? handleTutorialClick('addCaregiver') : handleAddCaregiver())}
      >
        <Text style={styles.addButtonText}>Add Caregiver</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.alertButton, getTutorialStyle('alertAll')]}
        onPress={() => (tutorialMode ? handleTutorialClick('alertAll') : sendSMSBlast([...caregivers]))}
      >
        <Text style={styles.alertButtonText}>Alert All</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalWrapper}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
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
    backgroundColor: '#6F91FF',
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