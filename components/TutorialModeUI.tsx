// The style for the tutorial mode words
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TutorialTooltip = ({ text }) => {
  if (!text) return null;

  return (
    <View style={styles.tooltip}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    marginHorizontal: 5,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 24,
  },
});

export default TutorialTooltip;