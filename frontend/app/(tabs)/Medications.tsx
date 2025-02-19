// Check medications page- if they have taken a medication, a check mark will
// apprear next to it (or they can toggle it themselves)
import React from 'react';
import MedList from '@/components/MedList';
import HelpButton from '@/components/HelpButton';
import DateDisplay from '@/components/DateDisplay';
import { StyleSheet, View } from 'react-native';

const helpText = 'Blah Blah Blah'

// All this does is call each different component
// Each one is housed in a <View> component to serve as
// a container for styling
export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        <DateDisplay />
      </View>
      <View style={styles.medListContainer}>
        <MedList />
      </View>
      <View style={styles.helpButtonContainer}>
        <HelpButton input={helpText} />
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  dateContainer: {

  },
  medListContainer: {
    width: '100%',
    height: '50%'
  },
  helpButtonContainer: {
    backgroundColor: 'green'
  },
});