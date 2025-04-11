// Catch-all screen for nonexistent pages
import { Link, Stack, useRouter } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Page not found' }} />
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, styles.button]}
          onPress={() => router.push('/')}
        >
          <FontAwesome size={64} name="home" color={'#fff'} />
          <Text style={styles.buttonText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D1001F',
    width: '40%',
    height: '15%',
    borderRadius: 24
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  }
});
