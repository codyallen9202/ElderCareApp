// Check medications page- if they have taken a medication, a check mark will
// apprear next to it (or they can toggle it themselves)
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// Learned more about checkboxes: https://stackoverflow.com/questions/32174317/how-to-set-default-checked-in-checkbox-reactjs
function Checkbox({ label, value, onChange }) {
  return(
    <View style={styles.checkboxContainer}>
      <Text style={styles.medicationText}>{label}</Text>

      <TouchableOpacity
        style={[styles.checkbox, value ? styles.checked : styles.unchecked]}
        onPress={onChange}
      >
        {value && <Text style={styles.checkMark}>✓</Text>}
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const router = useRouter();
  // Hard coded data- next step will be to take this data from the database
  const [medicationChecked, setMedicationChecked] = useState({medication1: false, medication2: false, medication3: false,});

  // Learned about prevState: https://stackoverflow.com/questions/54807454/what-is-prevstate-in-reactjs
  // Makes sense to use here becuase we want the check box to be pressed to the opposite of what 
  // is in its current state when the user presses it
  const handleCheckboxChange = (medication) => {
    setMedicationChecked((prevState) => ({
      ...prevState,
      [medication]: !prevState[medication],
    }));
    
  };


  return (
    <View style={styles.container}>

      <TouchableOpacity
          style={styles.helpButton}
          onPress={() => router.push('/HomePage')}
        >
        <Text style={styles.helpButtonText}>?</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Check Medications</Text>
      <Checkbox
        label="Medication 1"
        value={medicationChecked.medication1}
        onChange={() => handleCheckboxChange('medication1')}
      />
      <Checkbox
        label="Medication 2"
        value={medicationChecked.medication2}
        onChange={() => handleCheckboxChange('medication2')}
      />
      <Checkbox
        label="Medication 3"
        value={medicationChecked.medication3}
        onChange={() => handleCheckboxChange('medication3')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 80,
    marginBottom: 40,
  },
  checkboxContainer: {
    flexDirection: 'row',  // Label on the left and checkbox on the right
    alignItems: 'center',
    marginBottom: 50,
  },
  // Make the text left aligned (esp because medication names can be long)
  medicationText: {
    fontSize: 25,
    marginRight: 30, 
    textAlign: 'left', 
    flex: 1,
  },
  // Make the check box on the right side (make sure there's enough room for long medication names)
  checkbox: {
    width: 45,
    height: 45,
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unchecked: {
    borderColor: 'black',
  },
  checked: {
    borderColor: 'green',
    backgroundColor: 'lightgreen',
  },
  checkMark: {
    fontSize: 18,
    color: 'green',
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