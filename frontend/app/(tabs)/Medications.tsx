// Check medications page- if they have taken a medication, a check mark will
// apprear next to it (or they can toggle it themselves)
import React from 'react';
import MedList from '@/components/MedList';
import HelpButton from '@/components/HelpButton';
import { StyleSheet, View } from 'react-native';

const helpText = 'Blah Blah Blah'

export default function App() {
  return (
    <View style={StyleSheet.container}>
      <View style={StyleSheet.medList}>
        <MedList />
      </View>
      <View style={StyleSheet.helpButton}>
        <HelpButton input={helpText} />
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {

  },
  medList: {

  },
  helpButton: {

  },
});