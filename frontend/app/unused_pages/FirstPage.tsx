// Page that allows the user to go either to the home page or to their current routine event
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function FirstPage() {
  const router = useRouter();
  const handleButtonPress = (buttonName:string) => {
    alert(`Button "${buttonName}" pressed`);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.button1]} 
        onPress={() => router.push('/Medications')}
      >
        <Text style={styles.buttonText}>Current Activity</Text>
      </TouchableOpacity>

      {/* Button 2 - on the bottom */}
      <TouchableOpacity
        style={[styles.button, styles.button2]} 
        onPress={() => router.push('/HomePage')}
      >
        <Text style={styles.buttonText}>Home page</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.circularButton}
        onPress={() => console.log("Do something with the help button")}
      >
        <Text style={styles.circularButtonText}>?</Text>
      </TouchableOpacity>
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
  button: {
    paddingVertical: 20, // Tall button so there's more area for the elderly person to click on
    paddingHorizontal: 30, 
    borderRadius: 25, // Oval
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 200, 
    marginBottom: 20,
  },
  button1: {
    backgroundColor: '#3E88EF', // Blue
    marginTop: 40
  },
  button2: {
    backgroundColor: '#0DAC50', // Green
    marginTop: 90
  },
  buttonText: {
    color: '#fff', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  circularButton: {
    position: 'absolute', 
    top: 40, 
    right: 20, 
    width: 60, 
    height: 60, 
    backgroundColor: '#FF0000', // Red
    borderRadius: 30, // Circle
    justifyContent: 'center', 
    alignItems: 'center',
  },
  circularButtonText: {
    color: '#fff', 
    fontSize: 30, 
    fontWeight: 'bold',
  },
});