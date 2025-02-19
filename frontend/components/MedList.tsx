// A component to list the medications for the day
import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';

// will be replaced by a getMeds() function
const medications = [
    'Aspirin', 'Ibuprofen', 'Paracetamol', 'Metformin', 'Atorvastatin',
    'Amoxicillin', 'Lisinopril', 'Omeprazole', 'Losartan', 'Albuterol',
    'Gabapentin', 'Levothyroxine'
]; // 12 medications

export default function MedList() {

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {medications.map((med, index) => (
                    <Pressable key={index} style={styles.singleButton}>
                        <Text style={styles.buttonText}>{med}</Text>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: 'blue',
    },
    scrollContainer: {
        width: '100%'
    },
    singleButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        height: '15%',
        borderRadius: 15,
        backgroundColor: 'red',
        margin: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 25,
        fontWeight: '500'
    }
});