import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface HelpButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

const HelpButton: React.FC<HelpButtonProps> = ({ onPress, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.helpButton, style]}>
    <Text style={styles.helpButtonText}>?</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  helpButton: {
    position: 'absolute',
    left: 0,
    width: 60,
    height: 60,
    backgroundColor: '#6F91FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  helpButtonText: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: 'bold',
  },
});

export default HelpButton;