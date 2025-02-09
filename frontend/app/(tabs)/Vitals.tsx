import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function VitalsPage() {
  const handleButtonPress = (buttonName) => {
    alert(`Button "${buttonName}" pressed`);
  };
  
  return (
    // Title needs to be moved up to the top of the page
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.helpButton}
        onPress={() => handleButtonPress("Help Button")}
      >
        <Text style={styles.helpButtonText}>?</Text>
      </TouchableOpacity>

      <Text style={styles.text}>Vitals Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
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