// A component to list the medications for the day
import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, FlatList, Alert } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Will be replaced by a getMeds() function
// Each pill contains:
// id - A numerical id for backend purposes
// name - The name that will be displayed
// pillColor - A color that will be selected from a drop down menu; will be stored in hex
// days - The days of the week that the pill needs to be taken; stored as 1-7 array, 1 means pill is needed that day, 0 means it isn't
// time - The time of day that the pill needs to be taken
const medications = [
    { id: "1", name: "Aspirin", pillColor: "#000000", days: [1, 0, 1, 0, 1, 0, 0], time: "08:00 AM" },
    { id: "2", name: "Ibuprofen", pillColor: "#FF0000", days: [0, 1, 0, 1, 0, 1, 0], time: "12:00 PM" },
    { id: "3", name: "Paracetamol", pillColor: "#0000FF", days: [1, 1, 1, 1, 1, 1, 1], time: "07:00 AM" },
    { id: "4", name: "Metformin", pillColor: "#000000", days: [1, 1, 1, 1, 1, 1, 1], time: "06:30 PM" },
    { id: "5", name: "Atorvastatin", pillColor: "#FFD700", days: [1, 1, 1, 1, 1, 1, 1], time: "09:00 PM" },
    { id: "6", name: "Amoxicillin", pillColor: "#FFC0CB", days: [1, 0, 1, 0, 1, 0, 0], time: "01:00 PM" },
    { id: "7", name: "Lisinopril", pillColor: "#800080", days: [1, 1, 1, 1, 1, 1, 1], time: "10:00 AM" },
    { id: "8", name: "Omeprazole", pillColor: "#008000", days: [1, 1, 1, 1, 1, 1, 1], time: "07:30 AM" },
    { id: "9", name: "Losartan", pillColor: "#FFA500", days: [0, 1, 0, 1, 0, 1, 0], time: "08:30 AM" },
    { id: "10", name: "Albuterol", pillColor: "#000000", days: [0, 0, 0, 0, 0, 0, 0], time: "As Needed" },
    { id: "11", name: "Gabapentin", pillColor: "#0000FF", days: [1, 0, 1, 0, 1, 0, 0], time: "09:00 PM" },
    { id: "12", name: "Levothyroxine", pillColor: "#000000", days: [1, 1, 1, 1, 1, 1, 1], time: "06:00 AM" },
];

export default function MedList() {
    const [selectedMeds, setSelectedMeds] = useState<{ [key: string]: boolean }>({});

    // Changes the color to gray when a pill is pressed
    const handlePress = (id: string, name: string) => {
        setSelectedMeds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={medications}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Pressable
                        style={[styles.medItem, selectedMeds[item.id] ? styles.selected : null]}
                        onPress={() => handlePress(item.id, item.name)}
                    >
                        <View>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.details}>{item.time}</Text>
                        </View>
                        <MaterialCommunityIcons name="pill" size={60} color={item.pillColor} />
                    </Pressable>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 110,
        paddingTop: 20,
        backgroundColor: "#f4f4f4",
    },
    medItem: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    selected: {
        backgroundColor: "#999999",
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
    },
    details: {
        fontSize: 18,
        color: "#666",
    },
});