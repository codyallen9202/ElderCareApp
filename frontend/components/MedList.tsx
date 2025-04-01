// MedList.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, FlatList } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMedications } from './MedicationsProvider';

export default function MedList() {
  const [selectedMeds, setSelectedMeds] = useState<{ [key: string]: boolean }>({});
  const { medications } = useMedications();

  // Toggle selection style on press
  const handlePress = (id: string, name: string) => {
    setSelectedMeds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={medications}
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
            <MaterialCommunityIcons name="pill" size={60} color={item.pillColor} />
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
});
