import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import HelpButton from '@/components/HelpButton';
import useHealthData from '@/components/useHealthData';
import HeaderDisplay from '@/components/HeaderDisplay';
import { SafeAreaView } from 'react-native';

const helpText = `This page helps you track your vital signs, such as blood pressure, heart rate, and oxygen levels.`;

export default function VitalsPage() {
  const vitals = useHealthData();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <HeaderDisplay pageTitle={'Vitals'} />
      </View>

      {/* Entire list of 6 boxes */}
      <View style={styles.vitalContainer}>
        {/* Top Row */}
        <View style={styles.vitalsRow}>

          {/* Top Left */}
          <View style={styles.singleVital}>
            <View style={styles.singleVitalHeader}>
              <Text style={styles.vitalText}>Heart Rate</Text>
            </View>
            <View style={styles.singleVitalContent}>
              <Text style={styles.bigText}>{vitals.heartRate}</Text>
            </View>
          </View>

          {/* Top Right */}
          <View style={styles.singleVital}>
            <View style={styles.singleVitalHeader}>
              <Text style={styles.vitalText}>Resting Heart Rate</Text>
            </View>
            <View style={styles.singleVitalContent}>
              <Text style={styles.bigText}>{vitals.restingHeartRate}</Text>
            </View>
          </View>
        </View>

        {/* Middle Row */}
        <View style={styles.vitalsRow}>

          {/* Middle Left */}
          <View style={styles.singleVital}>
            <View style={styles.singleVitalHeader}>
              <Text style={styles.vitalText}>Breathing Rate</Text>
            </View>
            <View style={styles.singleVitalContent}>
              <Text style={styles.bigText}>{vitals.respiratoryRate}</Text>
            </View>
          </View>

          {/* Middle Right */}
          <View style={styles.singleVital}>
            <View style={styles.singleVitalHeader}>
              <Text style={styles.vitalText}>Steps</Text>
            </View>
            <View style={styles.singleVitalContent}>
              <Text style={styles.bigText}>{vitals.steps}</Text>
            </View>
          </View>
        </View>

        {/* Bottom Row */}
        <View style={styles.vitalsRow}>

          {/* Bottom Left */}
          <View style={styles.singleVital}>
            <View style={styles.singleVitalHeader}>
              <Text style={styles.vitalText}>Calories Burned</Text>
            </View>
            <View style={styles.singleVitalContent}>
              <Text style={styles.bigText}>{vitals.calories}</Text>
            </View>
          </View>

          {/* Bottom Right */}
          <View style={styles.singleVital}>
            <View style={styles.singleVitalHeader}>
              <Text style={styles.vitalText}>Sleep Duration</Text>
            </View>
            <View style={styles.singleVitalContent}>
              <Text style={styles.bigText}>{vitals.sleepDuration}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
  },
  header: {
    backgroundColor: '#6F91FF',
    width: '100%',
    alignItems: 'center',
    paddingBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF'
  },
  vitalContainer: {
    width: '100%',
    height: '100%',
  },
  vitalsRow: {
    width: '100%',
    height: '33.33%',
    flexDirection: 'row',
  },
  singleVital: {
    height: '100%',
    width: '50%',
    borderWidth: 1.5,
    borderColor: '#6F91FF',
    alignItems: 'center',
  },
  singleVitalHeader: {
    backgroundColor: '#6F91FF',
    width: '100%',
    alignItems: 'center'
  },
  vitalText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#FFF'
  },
  singleVitalContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigText: {
    fontSize: 55,
    fontWeight: 'bold',
    color: '#6F91FF'
  },
  smallText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#6F91FF'
  }
});

