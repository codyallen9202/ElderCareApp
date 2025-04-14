// Based on memory game found: https://javascript.plainenglish.io/building-a-card-memory-game-in-react-e6400b226b8f
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Button } from 'react-native';
import HeaderDisplay from '@/components/HeaderDisplay';
import TutorialModeUI from '@/components/TutorialModeUI';

const uniqueCards = ['♥', '★', '☀', '♫', '✓', '☺'];

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
  const [openCards, setOpenCards] = useState([]);
  const [clearedCards, setClearedCards] = useState({});
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState(false);
  const [moves, setMoves] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const timeout = useRef(null);

  useEffect(() => {
    let timeout = null;
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 300);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [openCards]);

  useEffect(() => {
    checkCompletion();
  }, [clearedCards]);

  const checkCompletion = () => {
    if (Object.keys(clearedCards).length === uniqueCards.length) {
      setShowModal(true);
      if (bestScore === null || moves < bestScore) {
        setBestScore(moves);
      }
    }
  };

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

  const handleCardPress = (index: number) => {
    if (shouldDisableAllCards || openCards.includes(index)) return;

    if (openCards.length === 1) {
      setOpenCards(prev => [...prev, index]);
    } else {
      clearTimeout(timeout.current!);
      setOpenCards([index]);
    }
  };

  const checkIsFlipped = (index: number) => {
    return openCards.includes(index);
  }

  const checkIsInactive = (card: string) => {
    return Boolean(clearedCards[card]);
  }

  const handleRestart = () => {
    setClearedCards({});
    setOpenCards([]);
    setShowModal(false);
    setMoves(0);
    setShouldDisableAllCards(false);
    setCards(shuffleCards([...uniqueCards, ...uniqueCards]));
  };

  return (
    <View style={styles.container}>
      <HeaderDisplay pageTitle={'Memory Game'} />

      <View style={styles.grid}>
        {cards.map((symbol, index) => {
          const isFlipped = checkIsFlipped(index);
          const isInactive = checkIsInactive(symbol);
          const showSymbol = isFlipped || isInactive;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.card,
                isFlipped && styles.cardFlipped,
                isInactive && styles.cardInactive,
              ]}
              onPress={() => handleCardPress(index)}
              disabled={shouldDisableAllCards || isFlipped || isInactive}
            >
              <Text style={styles.symbol}>{showSymbol ? symbol : '?'}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Text style={styles.numOfMovesText}>Moves: {moves}</Text>
        {bestScore !== null && <Text>Best Score: {bestScore}</Text>}
        <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
          <Text style={styles.restartText}>Restart</Text>
        </TouchableOpacity>
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
    height: '22%',
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
    marginTop: '10%',
    marginBottom: '10%'
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
  }
});