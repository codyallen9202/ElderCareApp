import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import HeaderDisplay from '@/components/HeaderDisplay';
import AddMedicationModal from '@/components/AddMedicationModal';
import { saveInfo } from '@/functions/gen-user';
import { MedicationsProvider } from '@/components/MedicationsProvider';
import HelpButton from '@/components/HelpButton';
import MedicationListContainer from '@/components/MedicationListContainer';
import TutorialTextOverlay from '@/components/TutorialTextOverlay';
import { toggleTutorialMode, handleTutorialClick, getTutorialStyle } from '@/functions/tutorial-functions';

export default function MedicationsPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [newMedStartDate, setNewMedDate] = useState('');
  const [newMedDaysOfWeek, setNewMedDaysOfWeek] = useState([-1]);
  const [userID, setUserID] = useState(null);

  const [tutorialMode, setTutorialMode] = useState(false);
  const [clickedElements, setClickedElements] = useState({});
  const [buttonExplanation, setButtonExplanation] = useState(null);

  const tutorialStatements = {
    addMed: 'Add a new medication to your list',
    list: 'View the medications you have to take',
    helpButton: 'Click this button to turn on tutorial mode and also to turn it off',
  };

  useEffect(() => {
    async function loadId() {
      const id = await SecureStore.getItemAsync('user_id');
      setUserID(id);
    }
    loadId();
  }, []);

  return (
    <MedicationsProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <HeaderDisplay pageTitle={'Medications'} />
          <HelpButton
            onPress={() => toggleTutorialMode(setTutorialMode, setClickedElements, setButtonExplanation)}
            style={getTutorialStyle(tutorialMode, clickedElements, 'helpButton')}
          />
        </View>

        <TutorialTextOverlay
          tutorialMode={tutorialMode}
          buttonExplanation={buttonExplanation}
          tutorialStatements={tutorialStatements}
        />

        <MedicationListContainer
          tutorialMode={tutorialMode}
          getTutorialStyle={(id) => getTutorialStyle(tutorialMode, clickedElements, id)}
          onAddPress={() =>
            tutorialMode
              ? handleTutorialClick('addMed', tutorialMode, setClickedElements, setButtonExplanation)
              : setModalVisible(true)
          }
          onListPress={() =>
            handleTutorialClick('list', tutorialMode, setClickedElements, setButtonExplanation)
          }
        />

        <AddMedicationModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={(medInfo) => saveInfo(medInfo, userID, 'Medications')}
          userID={userID}
        />
      </SafeAreaView>
    </MedicationsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F4F4F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
});
