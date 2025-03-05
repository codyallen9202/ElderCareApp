// index.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Calendar from '../../components/DisplaySchedule';
import { EventsProvider } from '../../components/DisplayEvents';
import {getUserId, InitializeFirestoreUser} from '../../functions/gen-user';

export default function LayoutPage() {
  const router = useRouter();
  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserId() {
      const id = await getUserId();
      setUserID(id);
      InitializeFirestoreUser(id);
    }
    loadUserId();
  }, []);

  return (
    <EventsProvider>
      <View style={styles.container}>
        {/* Calendar section showing today's events */}
        <View style={styles.calendar}>
          <Calendar currentDate={new Date()} dayOffset={0} />
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
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

          <View style={styles.buttonRow}>
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
    </EventsProvider>
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
