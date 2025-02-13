// Home page - user can go to any of the buttons they click
// Or they can just look at their schedule for the day
// Initial page must be named index.tsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function LayoutPage() {
  const router = useRouter();

  return (
    // Want calendar above the buttons
    <View style={styles.container}>
      <View style={styles.calendar}></View>

      <View style={styles.buttonContainer}> {/* Container for all 4 buttons */}
        <View style={styles.buttonRow}> {/* Container for top two buttons */}

          <TouchableOpacity
            style={[styles.button, styles.medicationButton]}
            onPress={() => router.push('/Medications')}
          >
            <FontAwesome5 size={72} name="pills" color={'#fff'} />
            <Text style={styles.buttonText}>Medications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.vitalsButton]}
            onPress={() => router.push('/Vitals')}
          >
            <FontAwesome size={72} name="heartbeat" color={'#fff'} />
            <Text style={styles.buttonText}>Vitals</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}> {/* Container for bottom two buttons */}
          <TouchableOpacity
            style={[styles.button, styles.scheduleButton]}
            onPress={() => router.push('/Schedule')}
          >
            <FontAwesome size={72} name="calendar" color={'#fff'} />
            <Text style={styles.buttonText}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.caregiversButton]}
            onPress={() => router.push('/Caregivers')}
          >
            <FontAwesome5 size={72} name="user-friends" color={'#fff'} />
            <Text style={styles.buttonText}>Caregivers</Text>
          </TouchableOpacity>

        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  calendar: {
    width: '100%',
    height: '50%',
    backgroundColor: '#FFFFC5', // Yellow
  },
  buttonContainer: {
    width: '100%',
    height: '50%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    height: '50%',
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scheduleButton: {
    backgroundColor: '#FFD700', // Yellow
  },
  medicationButton: {
    backgroundColor: '#008000', // Green
  },
  caregiversButton: {
    backgroundColor: '#6F91FF', // Blue
  },
  vitalsButton: {
    backgroundColor: '#D1001F', // Red
  },
});