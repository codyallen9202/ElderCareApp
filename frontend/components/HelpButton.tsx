import React from "react";
import { StyleSheet, View, Pressable, Alert, Text } from 'react-native';

export default function HelpButton({ input }: { input: string }) {
    return (
        <View>
            <Pressable
                style={styles.helpButton}
                onPress={() => {
                    Alert.alert("Title", input)
                    window.alert(input)
                }}
            >
                <Text style={styles.helpButtonText}>?</Text>
            </Pressable>

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