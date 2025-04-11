// MedList.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList } from 'react-native';
import { useMedications } from './MedicationsProvider';
import * as SecureStore from 'expo-secure-store';
import { handleDeleteMedication } from '@/functions/handle-medication';


export default function MedList() {
  const [selectedMeds, setSelectedMeds] = useState<{ [key: string]: boolean }>({});
  const { medications } = useMedications();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // strip time for accurate comparison

  const todaysMedications = medications.filter(med => {
    const isToday = med.days.includes(new Date().getDay() + 1);

    const startDate = new Date(med.startDate); // assuming med.start_date is 'YYYY-MM-DD'
    startDate.setHours(0, 0, 0, 0); // strip time as well

    return isToday && today >= startDate;
  }); 

  const handleDelete = async (id: string) => {
    const userId = await SecureStore.getItemAsync('user_id');
    await handleDeleteMedication(id, userId);
  };  

  // Toggle selection style on press
  const handlePress = (id: string, name: string) => {
    setSelectedMeds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      
      <FlatList
        data={todaysMedications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.medItem, selectedMeds[item.id] ? styles.selected : null]}
            onPress={() => handlePress(item.id, item.name)}
          >
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.details}>{item.time}</Text>
            </View>
            <Pressable onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteText}>✖</Text>
            </Pressable>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 110,
    paddingTop: 20,
    backgroundColor: "#f4f4f4",
  },
  medItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selected: {
    backgroundColor: "#999999",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  details: {
    fontSize: 18,
    color: "#666",
  },
  deleteText: {
    fontSize: 30,
    color: '#F44336',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginLeft: 10,
  },
  
});
