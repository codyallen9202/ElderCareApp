// Displays the date in format of
//    Weekday
// Day Month Year
// Used on Meds page and possibly calendar
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import getDate from '@/functions/get-date';

export default function DateDisplay() {
    const today = getDate();

    return (
        <View style={styles.container}>
            <Text style={styles.weekday}>{today[3]}</Text>
            <Text style={styles.date}>{today[2]} {today[1]} {today[0]}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    weekday: {
        fontWeight: 600,
        fontSize: 36,
    },
    date: {
        fontWeight: 400,
        fontSize: 25,
    }
});