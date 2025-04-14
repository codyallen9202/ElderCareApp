// Based on memory game found: https://javascript.plainenglish.io/building-a-card-memory-game-in-react-e6400b226b8f
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import HeaderDisplay from '@/components/HeaderDisplay';
import TutorialModeUI from '@/components/TutorialModeUI';

const uniqueCards = ['♥', '★', '☀', '♫', '✓', '☺'];

// Cards should be randomized every time the user gets to it and restarts the game
function shuffleCards(array: string[]) {
  const length = array.length;
  for (let i = length; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    const currentIndex = i - 1;
    const temp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<string[]>(() =>
    shuffleCards([...uniqueCards, ...uniqueCards])
  );
  const [openCards, setOpenCards] = useState<number[]>([]);
  const [clearedCards, setClearedCards] = useState<Record<string, boolean>>({});
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  // Tutorial mode
  const [tutorialMode, setTutorialMode] = useState(false);
  const [clickedElements, setClickedElements] = useState<Record<string, boolean>>({});
  const [buttonExplanation, setButtonExplanation] = useState<string | null>(null);

  const tutorialStatements = {
    movesText: 'Shows the number of moves you’ve made.',
    restartButton: 'Click here to restart the game.',
    gameCard: 'Tap each card to show the other side. Match all the cards to win!',
    helpButton: 'Click this button to turn on tutorial mode and also to turn it off',
  };

  // Let user see the cards before we check if they match or not
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 300);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [openCards]);

  useEffect(() => {
    checkCompletion();
  }, [clearedCards]);

  // Check and see if all cards have been matched
  const checkCompletion = () => {
    if (Object.keys(clearedCards).length === uniqueCards.length) {
      setShowModal(true);
      if (bestScore === null || moves < bestScore) {
        setBestScore(moves);
      }
    }
  };

  // Check and see whether two cards match
  const evaluate = () => {
    const [first, second] = openCards;
    if (cards[first] === cards[second]) {
      setClearedCards(prev => ({ ...prev, [cards[first]]: true }));
      setOpenCards([]);
    } else {
      timeout.current = setTimeout(() => setOpenCards([]), 500);
    }
    setMoves(prev => prev + 1);
    setShouldDisableAllCards(false);
  };

  // When user presses a card, flip it over so they can see the symbol
  const handleCardPress = (index: number) => {
    if (shouldDisableAllCards || openCards.includes(index)) return;

    if (openCards.length === 1) {
      setOpenCards(prev => [...prev, index]);
    } else {
      if (timeout.current) clearTimeout(timeout.current);
      setOpenCards([index]);
    }
  };

  const checkIsFlipped = (index: number) => openCards.includes(index);

  const checkIsInactive = (card: string) => Boolean(clearedCards[card]);

  const handleRestart = () => {
    setClearedCards({});
    setOpenCards([]);
    setShowModal(false);
    setMoves(0);
    setShouldDisableAllCards(false);
    setCards(shuffleCards([...uniqueCards, ...uniqueCards]));
  };

  // Needed for tutorial mode (similar to the other pages)
  const handleTutorialClick = (id: string) => {
    if (!tutorialMode) return;
    setClickedElements(prev => (prev[id] ? {} : { [id]: true }));
    setButtonExplanation(prev => (prev === id ? null : id));
  };

  const getTutorialStyle = (id: string) =>
    tutorialMode
      ? {
          borderWidth: 4,
          borderColor: clickedElements[id] ? '#FFC067' : '#FF0000',
          borderStyle: 'solid',
        }
      : {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setTutorialMode(prev => !prev)}
          style={[styles.helpButton, getTutorialStyle('helpButton')]}
          onPressIn={() => handleTutorialClick('helpButton')}
        >
          <Text style={styles.helpButtonText}>?</Text>
        </TouchableOpacity>
        <HeaderDisplay pageTitle={'Memory Game'} />
      </View>

      <TutorialModeUI
        text={tutorialMode ? tutorialStatements[buttonExplanation!] || tutorialStatements.helpButton : null}
      />

      <View style={styles.grid}>
        {cards.map((symbol, index) => {
          const isFlipped = checkIsFlipped(index);
          const isInactive = checkIsInactive(symbol);
          const showSymbol = isFlipped || isInactive;

          // Apply highlight to first card only in tutorial mode
          const tutorialHighlight = tutorialMode && index === 0 ? getTutorialStyle('gameCard') : {};

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                isFlipped && styles.cardFlipped,
                isInactive && styles.cardInactive,
                tutorialHighlight,
              ]}
              onPress={() => {
                if (tutorialMode && index === 0) {
                  handleTutorialClick('gameCard');
                } else if (!tutorialMode) {
                  handleCardPress(index);
                }
              }}
              disabled={shouldDisableAllCards || isFlipped || isInactive}
            >
              <Text style={styles.symbol}>{showSymbol ? symbol : '?'}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
        <TouchableOpacity
          onPressIn={() => handleTutorialClick('movesText')}
          activeOpacity={1}
          style={getTutorialStyle('movesText')}
        >
          <Text style={styles.numOfMovesText}>Moves: {moves}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.restartButton, getTutorialStyle('restartButton')]}
          onPress={handleRestart}
          onPressIn={() => handleTutorialClick('restartButton')}
        >
          <Text style={styles.restartText}>Restart</Text>
        </TouchableOpacity>
      </View>
      {bestScore !== null && <Text style={styles.bestScore}>Best Score: {bestScore}</Text>}
      </View>

      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎉 You Won!</Text>
            <Text>You completed the game in {moves} moves.</Text>
            <Text>Your best score for these rounds has been: {bestScore}</Text>
            <Button title="Restart" onPress={handleRestart} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
  },
  card: {
    width: '25%',
    height: '20%',
    margin: '3%',
    backgroundColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFlipped: {
    backgroundColor: '#fff',
  },
  cardInactive: {
    opacity: 0.4,
  },
  symbol: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: '2%',
    marginBottom: '30%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  numOfMovesText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: '2%',
  },
  restartButton: {
    backgroundColor: '#6F91FF',
    paddingVertical: '1.5%',
    paddingHorizontal: '4%',
    borderRadius: 20,
    alignItems: 'center',
  },
  restartText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
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
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16, 
    marginBottom: 10,
  },
});