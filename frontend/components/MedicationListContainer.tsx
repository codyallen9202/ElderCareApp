import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import MedList from '@/components/MedicationList';
import PlusButton from '@/components/PlusButton';

interface Props {
  tutorialMode: boolean;
  getTutorialStyle: (id: string) => object;
  onAddPress: () => void;
  onListPress: () => void;
}

const MedicationListContainer: React.FC<Props> = ({
  tutorialMode,
  getTutorialStyle,
  onAddPress,
  onListPress,
}) => {
  const containerStyle = [styles.medListContainer, tutorialMode && getTutorialStyle('list')];
  const content = (
    <>
      <MedList />
      <View style={styles.addButton}>
        <PlusButton onPress={onAddPress} />
      </View>
    </>
  );

  return tutorialMode ? (
    <TouchableOpacity style={containerStyle} onPress={onListPress} activeOpacity={0.7}>
      {content}
    </TouchableOpacity>
  ) : (
    <View style={containerStyle}>{content}</View>
  );
};

const styles = StyleSheet.create({
  medListContainer: {
    flex: 1,
    borderRadius: 10,
    padding: 5,
    overflow: 'hidden',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default MedicationListContainer;
