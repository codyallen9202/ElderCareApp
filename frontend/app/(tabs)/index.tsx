// Sign up page- user needs to choose whether they are users or caregivers,
// enter their name, and click the sign up button

import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';


export default function index() {
  const [name, setName] = useState('');
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          // Have tall oval dresses with different colors for each button
          style={[styles.button, styles.button1]}
          onPress={() => router.push('/FirstPage')}
        >
          <Text style={styles.buttonText}>User</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.button2]} 
          onPress={() => router.push('/FirstPage')}
        >
          <Text style={styles.buttonText}>Caregiver</Text>
        </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName} // Updates the state with the typed name
      />
      <TouchableOpacity
        style={[styles.button, styles.button3]} // Apply purple color to this button
        onPress={() => router.push('/FirstPage')}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    marginTop: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 30, 
  },
  button: {
    paddingVertical: 30,
    paddingHorizontal: 30,
    borderRadius: 25, 
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 150, 
  },
  button1: {
    backgroundColor: '#A9A600', // Yellow
  },
  button2: {
    backgroundColor: '#800000', // Maroon
  },
  button3: {
    backgroundColor: '#6C3BAA',  // Purple
    marginTop: 400, 
    position: 'absolute', 
  },
  buttonText: {
    color: '#fff', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 50, 
    borderBottomWidth: 1,
    borderColor: '#ccc', 
    width: '80%',
    paddingLeft: 10, 
    marginTop: 80, 
    marginBottom: 20, 
    fontSize: 22,
  },
});