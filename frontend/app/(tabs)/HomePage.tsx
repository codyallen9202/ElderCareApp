// Home page - user can go to any of the buttons they click
// Or they can just look at their schedule for the day
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { blue } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

export default function LayoutPage() {
  const router = useRouter();

  return (
    // Want calendar above the buttons
    <View style={styles.container}>
      <View style={styles.calendar}></View>

      <View style={styles.buttonContainer}> {/* Container for all 4 buttons */}
        <View style={styles.buttonRow}> {/* Container for top two buttons */}
          <TouchableOpacity
            style={[styles.button, styles.scheduleButton]}
            onPress={() => router.push('/Schedule')}
          >
            <Text style={styles.buttonText}>picSchedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.medicationButton]}
            onPress={() => router.push('/Medications')}
          >
            <Text style={styles.buttonText}>picMedication</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}> {/* Container for bottom two buttons */}
          <TouchableOpacity
            style={[styles.button, styles.caregiversButton]}
            onPress={() => router.push('/CaregiversList')}
          >
            <Text style={styles.buttonText}>picCaregivers</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.vitalsButton]}
            onPress={() => router.push('/Vitals')}
          >
            <Text style={styles.buttonText}>picVitals</Text>
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