import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { saveInfo, deleteCaretaker, createUserId, InitializeFirestoreUser } from '@/functions/gen-user';
import {doc, getDoc} from "firebase/firestore";
import { db } from "../../firebaseconfig";
import { useRouter } from 'expo-router';


export default function UserInfoScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [referral, setReferral] = useState('');
  const [userId, setUserId] = useState('');

  const handleSubmit = async () => {
    try {
      const ref = doc(db, "Users", referral);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        console.log("Referral Code is Invalid");
      }
      else {
        const userId = await createUserId("Caregiver", referral); 
        await InitializeFirestoreUser(referral + "Care", name, age, "Caregiver");  
        setUserId(userId);
        console.log("Proceeding with ID: " + userId);
        leavePage();
      } 
    } catch (error) {
      console.error('Error during submit:', error);
    }
  };
  const leavePage = () => {
    router.push('/(tabs)');
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Elder Care Application</Text>
        <Text style={styles.subText}>Tell us about yourself</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Referral Number"
          value={referral}
          onChangeText={setReferral}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
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
  headerContainer: {
    position: 'absolute',
    top: 80,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  formContainer: {
    width: '80%',
    gap: 20,
    marginTop: 60,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#6F91FF',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
