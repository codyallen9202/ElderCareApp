import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HelpButton() {
    const router = useRouter();

    return (
        <View>
            <TouchableOpacity
                style={styles.helpButton}
                onPress={() => router.push('/(tabs)/')}
            >
                <Text style={styles.helpButtonText}>?</Text>
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    helpButton: {
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