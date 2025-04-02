import React from "react";
import { StyleSheet, View, Pressable } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function PlusButton({ onPress }) {
    return (
        <View>
            <Pressable style={styles.addButton} onPress={onPress}>
                <AntDesign name="plus" size={36} color="#fff" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    addButton: {
        width: 60,
        height: 60,
        backgroundColor: '#6F91FF',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
