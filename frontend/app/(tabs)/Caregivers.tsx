import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function CaregiversList() {
  const router = useRouter();
    // Hard code caregivers for right now
  const caregivers = [
    'Caregiver #1',
    'Caregiver #2',
  ];

  const handleAlertAll = () => {
    alert('Alert All Pressed');
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.helpButton}
        onPress={() => router.push('/HomePage')}
      >
      <Text style={styles.helpButtonText}>?</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Caregivers List</Text>

      <View style={styles.list}>
        {caregivers.map((caregiver, index) => (
          <View key={index} style={styles.caregiver}>
            <Text style={styles.caregiverText}>{caregiver}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.alertButton} onPress={handleAlertAll}>
        <Text style={styles.alertButtonText}>Alert All</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000', // Black
    marginTop: 90,
    marginBottom: 50,
  },
  list: {
    width: '100%',
    marginBottom: 30,
  },
  caregiver: {
    backgroundColor: '#E0BBE4', // Light purple background
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  caregiverText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // dark gray
  },
  alertButton: {
    backgroundColor: '#F4BC1C', // light purple
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto', // Put button at bottom of the page and then specify how far from bottom you want it
    marginBottom: 50,
  },
  alertButtonText: {
    color: '#FFFFFF', // white
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpButton: {
    position: 'absolute', 
    top: 40, 
    right: 20, 
    width: 60, 
    height: 60, 
    backgroundColor: '#FF0000', // Red
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  helpButtonText: {
    color: '#fff', 
    fontSize: 30, 
    fontWeight: 'bold',
  }
});