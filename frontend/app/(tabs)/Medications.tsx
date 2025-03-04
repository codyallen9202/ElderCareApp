// Check medications page- if they have taken a medication, a check mark will
// apprear next to it (or they can toggle it themselves)
import React from 'react';
import MedList from '@/components/MedList';
import HelpButton from '@/components/HelpButton';
import DateDisplay from '@/components/DateDisplay';
import AddMedicationButton from '@/components/AddMedicationButton';
import { StyleSheet, View } from 'react-native';

// The help text for the page
const helpText = "This page lists all of the medications you need to take today. When you've taken a medication, tap it, and it will turn gray. When a medication is grayed-out, that means you have taken it."

// All this does is call each different component
// Each one is housed in a <View> component to serve as
// a container for styling
export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <DateDisplay />
        <View style={styles.helpButton}>
          <HelpButton input={helpText} />
        </View>
        <View style={styles.addButton}>
          <AddMedicationButton />
        </View>
      </View>
      <View style={styles.medListContainer}>
        <MedList />
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
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
    marginTop: 25,
    width: '100%',
    height: '100%',
  },
});