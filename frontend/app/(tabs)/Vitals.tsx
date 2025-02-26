import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import HelpButton from '@/components/HelpButton';

const helpText = `This page helps you track your vital signs, such as blood pressure, heart rate, and oxygen levels.`;

export default function VitalsPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <HelpButton input={helpText} />
      <Text style={styles.title}>Vitals</Text>

      <View style={styles.vitalContainer}>
        <Text style={styles.vitalLabel}>❤️ Heart Rate:</Text>
        <Text style={styles.vitalValue}>72 bpm</Text>
      </View>

      <View style={styles.vitalContainer}>
        <Text style={styles.vitalLabel}>🩸 Blood Oxygen:</Text>
        <Text style={styles.vitalValue}>98%</Text>
      </View>

      <View style={styles.vitalContainer}>
        <Text style={styles.vitalLabel}>🌡 Body Temp:</Text>
        <Text style={styles.vitalValue}>36.5°C</Text>
      </View>

      <View style={styles.vitalContainer}>
        <Text style={styles.vitalLabel}>📉 Blood Pressure:</Text>
        <Text style={styles.vitalValue}>120/80 mmHg</Text>
      </View>

      <View style={styles.vitalContainer}>
        <Text style={styles.vitalLabel}>👣 Steps Today:</Text>
        <Text style={styles.vitalValue}>8,420</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  vitalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    backgroundColor: '#E0BBE4',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  vitalLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  vitalValue: {
    fontSize: 24,
    color: '#000',
  },
});

