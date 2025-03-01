import React from "react";
import { StyleSheet, View, Pressable, Text } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import addMedication from "@/functions/add-medicaton";

export default function AddMedicationButton() {
    const handlePress = () => {
        addMedication();
    }

    return (
        <View>
            <Pressable
                style={styles.addButton}
                onPress={() => handlePress}
            >
                <AntDesign name="plus" size={36} color="#fff" />
            </Pressable>

        </View>

    )
}

const styles = StyleSheet.create({
    addButton: {
        width: 60,
        height: 60,
        backgroundColor: '#6F91FF', // Red
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    }
});