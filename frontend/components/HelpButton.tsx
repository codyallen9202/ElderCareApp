import React from "react";
import { StyleSheet, View, Button, Alert } from 'react-native';

export default function HelpButton({ input }: { input: string }) {

    return (
        <View>
            <Button
                title='?'
                onPress={() => Alert.alert(input)}
            />
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