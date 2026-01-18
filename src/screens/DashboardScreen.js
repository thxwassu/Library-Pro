import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, ProgressBar } from 'react-native-paper';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { ThemeContext } from '../../App';

export default function DashboardScreen() {
  const { isDarkMode } = useContext(ThemeContext);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "books"), where("userId", "==", auth.currentUser.uid));
    return onSnapshot(q, (s) => setCount(s.size));
  }, []);

  const progress = count / 50; // Goal of 50 books

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0F0F0F' : '#F5F5F5' }]}>
      <Text variant="headlineMedium" style={styles.header}>Reading Stats</Text>
      <Card style={[styles.card, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF' }]}>
        <Card.Content>
          <Text variant="titleLarge" style={{color: '#D4AF37'}}>Library Progress</Text>
          <Text variant="displaySmall" style={{color: isDarkMode ? 'white' : 'black', marginVertical: 10}}>{count} Books</Text>
          <ProgressBar progress={progress} color="#D4AF37" style={{height: 10, borderRadius: 5}} />
          <Text style={{marginTop: 10, color: '#888'}}>{Math.round(progress * 100)}% of your yearly goal</Text>
        </Card.Content>
      </Card>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: 'center' },
  header: { color: '#D4AF37', marginBottom: 30, fontWeight: 'bold' },
  card: { padding: 20, borderRadius: 15, elevation: 5 }
});