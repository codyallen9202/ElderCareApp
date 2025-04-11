import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal, Platform, StyleSheet
} from 'react-native';
import { BlurView } from 'expo-blur';
import NeatDatePicker from 'react-native-neat-date-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DayPicker } from 'react-native-picker-weekday';
import { handleAddMedication } from '@/functions/handle-medication';

interface AddMedicationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (med: {
    id: string;
    name: string;
    time: string;
    startDate: string;
    daysOfWeek: number[];
  }) => void;
  userID: string | null;
}

export default function AddMedicationModal({
  visible, onClose, onSave, userID
}: AddMedicationModalProps) {
  const [newMedName, setNewMedName] = useState('');
  const [newMedTime, setNewMedTime] = useState('');
  const [newMedStartDate, setNewMedDate] = useState('');
  const [newMedDaysOfWeek, setNewMedDaysOfWeek] = useState<number[]>([-1]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = async () => {
    if (!newMedName.trim() || !newMedTime.trim() || !newMedStartDate.trim() || !newMedDaysOfWeek) {
      alert("Please fill all fields.");
      return;
    }
  
    const medInfo = {
      id: Date.now().toString(),
      name: newMedName,
      time: newMedTime,
      startDate: newMedStartDate,
      daysOfWeek: newMedDaysOfWeek
    };
  
    await handleAddMedication(medInfo, userID);
  
    // Reset form
    setNewMedName('');
    setNewMedTime('');
    setNewMedDate('');
    setNewMedDaysOfWeek([-1]);
    onClose();
  };
  

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalWrapper}>
        {Platform.OS === 'web'
          ? <View style={styles.modalBackgroundFallback} />
          : <BlurView intensity={50} style={styles.modalBackground} />
        }

        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add New Medication</Text>

          <TextInput
            style={styles.input}
            placeholder="Medication Name"
            placeholderTextColor="#888"
            value={newMedName}
            onChangeText={setNewMedName}
          />

          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ width: '100%' }}>
            <TextInput
              style={styles.input}
              placeholder="Start Date"
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

          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={{ width: '100%' }}>
            <TextInput
              style={styles.input}
              placeholder="Time"
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

          <Text style={{ fontSize: 18, marginBottom: 5 }}>Select Days:</Text>
          <DayPicker
            weekdays={newMedDaysOfWeek}
            setWeekdays={setNewMedDaysOfWeek}
            activeColor="violet"
            textColor="black"
            inactiveColor="#D3D3D3"
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
              <Text style={styles.modalButtonText}>✔ Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.modalButtonText}>✖ Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', position: 'absolute' },
  modalBackground: { position: 'absolute', width: '100%', height: '100%' },
  modalBackgroundFallback: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 16, padding: 25, alignItems: 'center' },
  modalTitle: { fontSize: 30, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', borderWidth: 1, borderColor: '#bbb', borderRadius: 10, padding: 18, fontSize: 22, marginBottom: 15, backgroundColor: '#F8F8F8' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
  modalButton: { flex: 1, backgroundColor: '#4CAF50', paddingVertical: 20, borderRadius: 10, alignItems: 'center', marginHorizontal: 10 },
  cancelButton: { backgroundColor: '#F44336' },
  modalButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
});
