import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import HelpButton from '@/components/HelpButton';

const helpText = `This page helps you track your vital signs, such as blood pressure, heart rate, and oxygen levels.`;

export default function VitalsPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HelpButton input={helpText} />
        <Text style={styles.title}>Vitals</Text>
      </View>

      <View style={styles.vitalContainer}>
        <View style={styles.vitalsRow}>
          <View style={styles.singleVital}>

          </View>
          <View style={styles.singleVital}>

          </View>
        </View>
        <View style={styles.vitalsRow}>
          <View style={styles.singleVital}>

          </View>
          <View style={styles.singleVital}>

          </View>
        </View>
      </View>

      {/* <View style={styles.vitalContainer}>
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
        <Text style={styles.vitalLabel}>📉 Blood Press:</Text>
        <Text style={styles.vitalValue}>120/80 mmHg</Text>
      </View>

      <View style={styles.vitalContainer}>
        <Text style={styles.vitalLabel}>👣 Steps Today:</Text>
        <Text style={styles.vitalValue}>8,420</Text>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    borderWidth: 3,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  vitalContainer: {
    borderWidth: 3,
    width: '100%',
    height: '100%',
  },
  vitalsRow: {
    width: '100%',
    height: '50%',
    flexDirection: 'row',
    borderWidth: 3,
  },
  singleVital: {
    height: '100%',
    width: '50%',
    borderWidth: 3,

  }
  // vitalLabel: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   color: '#333',
  // },
  // vitalValue: {
  //   fontSize: 24,
  //   color: '#000',
  // },
});

