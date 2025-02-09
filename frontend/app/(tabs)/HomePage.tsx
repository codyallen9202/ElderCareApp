// Home page - user can go to any of the buttons they click
// Or they can just look at their schedule for the day
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function LayoutPage() {
  const handleButtonPress = (buttonName) => {
    alert(`${buttonName} pressed`);
  };

  return (
    // Want calendar above the buttons
    <View style={styles.container}>
      <View style={styles.calendar}></View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.scheduleButton]}
          onPress={() => handleButtonPress("Button 1")}
        >
          <Text style={styles.buttonText}>picSchedule</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.medicationButton]}
          onPress={() => handleButtonPress("Button 2")}
        >
          <Text style={styles.buttonText}>picMedication</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.caregiversButton]}
          onPress={() => handleButtonPress("Button 3")}
        >
          <Text style={styles.buttonText}>picCaregivers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.vitalsButton]}
          onPress={() => handleButtonPress("Button 4")}
        >
          <Text style={styles.buttonText}>picVitals</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  calendar: {
    width: 300,
    height: 400,
    backgroundColor: '#FFFFC5', // Yellow
    marginBottom: 40, // Want enough space between calendar and buttons so does not look cluttered
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 60,
  },
  button: {
    width: 120,
    height: 90,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10, 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scheduleButton: {
    backgroundColor: '#FFEE8C', // Yellow
  },
  medicationButton: {
    backgroundColor: '#008000', // Green
  },
  caregiversButton: {
    backgroundColor: '#9370DB', // Purple
  },
  vitalsButton: {
    backgroundColor: '#D1001F', // Red
  },
});