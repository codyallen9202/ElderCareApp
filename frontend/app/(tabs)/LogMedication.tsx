// Need to add functionality to
// Overall, on this page, the user will be able to scan the QR code on their
// pill bottle. This will be added into the database as a pill they have taken on that day
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ScanQRCodePage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.helpButton}
        onPress={() => router.push('/HomePage')}
      >
      <Text style={styles.helpButtonText}>?</Text>
      </TouchableOpacity>
    
    <View style={styles.container}>
      <Text style={styles.title}>
        Scan the QR code on the pill bottle that you are taking to log the pill!
      </Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
  },
  helpButton: {
    position: 'absolute', 
    top: 40, 
    right: 20, 
    width: 60, 
    height: 60, 
    backgroundColor: '#FF0000', // Red
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  helpButtonText: {
    color: '#fff', 
    fontSize: 30, 
    fontWeight: 'bold',
  }
});