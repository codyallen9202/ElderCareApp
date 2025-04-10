import React, { useEffect, useState } from 'react';

import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as SecureStore from 'expo-secure-store';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import { EventsProvider } from '../../components/DisplayEvents';
import HeaderDisplay from '@/components/HeaderDisplay';
import HomePageSchedule from '@/components/HomePageSchedule';

export default function LayoutPage() {
  const router = useRouter();
  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserId() {
      //await SecureStore.deleteItemAsync('user_id'); 
      //await SecureStore.deleteItemAsync('user_type'); 
      const id = await SecureStore.getItemAsync('user_id');
      if (!id) {
        console.log("Hello! You have no ID");
        router.push("/SignUpPages/SignUp");
      }
      setUserID(id);
    }
    loadUserId();
  }, []);

  return (
    <EventsProvider>
      <SafeAreaView style={styles.container}>
        {/* Calendar section showing today's events */}
        <View style={styles.header}>
          <HeaderDisplay pageTitle={'Home'} />
        </View>

        <View style={styles.calendar}>
          <HomePageSchedule currentDate={new Date()} dayOffset={0} />
          {/* <Calendar currentDate={new Date()} dayOffset={0} /> */}
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.medicationButton]}
              onPress={() => router.push('/Medications')}
            >
              <FontAwesome5 size={72} name="pills" color={'#6F91FF'} />
              <Text style={styles.buttonText}>Medications</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.vitalsButton]}
              onPress={() => router.push('/Vitals')}
            >
              <FontAwesome size={72} name="heartbeat" color={'#6F91FF'} />
              <Text style={styles.buttonText}>Vitals</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.scheduleButton]}
              onPress={() => router.push('/Schedule')}
            >
              <FontAwesome size={72} name="calendar" color={'#6F91FF'} />
              <Text style={styles.buttonText}>Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.caregiversButton]}
              onPress={() => router.push('/Caregivers')}
            >
              <FontAwesome5 size={72} name="user-friends" color={'#6F91FF'} />
              <Text style={styles.buttonText}>Caregivers</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </EventsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F4F4F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  calendar: {
    width: '100%',
    // backgroundColor: '#FFF',
  },
  buttonContainer: {
    width: '100%',
    height: '50%',
    position: 'absolute',
    bottom: 0,
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
    borderWidth: 1.5,
    borderColor: '#6F91FF',
  },
  buttonText: {
    color: '#6F91FF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scheduleButton: {
    backgroundColor: '#FFF',
  },
  medicationButton: {
    backgroundColor: '#FFF',
    borderTopWidth: 3,
  },
  caregiversButton: {
    backgroundColor: '#FFF',
  },
  vitalsButton: {
    backgroundColor: '#FFF',
    borderTopWidth: 3,
  },
});
