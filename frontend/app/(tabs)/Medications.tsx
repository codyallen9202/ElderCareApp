// Check medications page- if they have taken a medication, a check mark will
// apprear next to it (or they can toggle it themselves)
import React from 'react';
import MedList from '@/components/MedList';
import HelpButton from '@/components/HelpButton';
import DateDisplay from '@/components/DateDisplay';
import { StyleSheet, View } from 'react-native';

// The help text for the page
const helpText = `This page displays a list of medications scheduled for today. 
                  Each medication is shown in a scrollable list. You can tap on 
                  a medication to mark it as taken, which will toggle a checkmark 
                  next to it. If you accidentally mark a medication, simply tap 
                  it again to remove the checkmark. The date at the top helps 
                  you confirm that you're viewing today's medications.`

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