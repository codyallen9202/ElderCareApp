import React from "react";
import { StyleSheet, View, Pressable, Alert, Text } from 'react-native';

export default function HelpButton({ input }: { input: string }) {
    return (
        <View>
            <Pressable
                style={styles.helpButton}
                onPress={() => {
                    Alert.alert("Page Info", input)
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
        backgroundColor: '#6F91FF',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    helpButtonText: {
        color: '#FFF',
        fontSize: 48,
        fontWeight: 'bold',
    }
});