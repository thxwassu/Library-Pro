import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, Card, FAB, IconButton, Portal, Dialog, TextInput, Button } from 'react-native-paper';
import { collection, query, where, onSnapshot, deleteDoc, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { auth, db } from '../../firebaseConfig';
import { ThemeContext } from '../../App';

export default function HomeScreen({ navigation }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [books, setBooks] = useState([]);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  
  const [title, setTitle] = useState('');
  const [isbn, setIsbn] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "books"), where("userId", "==", auth.currentUser.uid));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setBooks(data);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });
    return unsubscribe;
  }, []);

  const handleSaveNewBook = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a book title");
      return;
    }
    try {
      await addDoc(collection(db, "books"), {
        title: title,
        isbn: isbn || "N/A",
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      setAddVisible(false);
      setTitle(''); setIsbn('');
      Alert.alert("Success", "Book saved to Cloud!");
    } catch (e) {
      Alert.alert("Error", "Could not save: " + e.message);
    }
  };

  const exportPDF = async () => {
    const html = `<h1>My Library</h1><ul>${books.map(b => `<li>${b.title}</li>`).join('')}</ul>`;
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  const dynamicText = isDarkMode ? 'white' : 'black';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0F0F0F' : '#F5F5F5' }]}>
      <View style={styles.headerRow}>
        <Text variant="headlineMedium" style={{ color: '#D4AF37', fontWeight: 'bold' }}>Collection</Text>
        <IconButton icon="file-pdf-box" iconColor="#D4AF37" onPress={exportPDF} />
      </View>

      <FlatList data={books} keyExtractor={item => item.id} renderItem={({ item }) => (
        <Card style={[styles.card, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF' }]}>
          <Card.Title title={item.title} subtitle={`ISBN: ${item.isbn}`} titleStyle={{color: dynamicText}} right={(p) => (
            <View style={{flexDirection:'row'}}>
              <IconButton {...p} icon="pencil" onPress={() => { setCurrentBook(item); setTitle(item.title); setEditVisible(true); }} />
              <IconButton {...p} icon="delete" onPress={() => deleteDoc(doc(db, "books", item.id))} />
            </View>
          )} />
        </Card>
      )} />

      <View style={styles.fabGroup}>
        <FAB icon="plus" label="Manual Add" style={styles.fabSmall} onPress={() => setAddVisible(true)} />
        <FAB icon="barcode-scan" label="Scan Barcode" style={styles.fabMain} onPress={() => navigation.navigate('Scanner')} />
      </View>

      <Portal>
        <Dialog visible={addVisible} onDismiss={() => setAddVisible(false)} style={{backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF'}}>
          <Dialog.Title style={{color: dynamicText}}>Add Book Manually</Dialog.Title>
          <Dialog.Content>
            <TextInput label="Title" value={title} onChangeText={setTitle} mode="outlined" style={{marginBottom: 10}} />
            <TextInput label="ISBN" value={isbn} onChangeText={setIsbn} mode="outlined" />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setAddVisible(false)}>Cancel</Button>
            <Button onPress={handleSaveNewBook}>Save to Database</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 },
  card: { marginBottom: 12, borderRadius: 12 },
  fabGroup: { position: 'absolute', right: 20, bottom: 20, alignItems: 'center' },
  fabMain: { backgroundColor: '#D4AF37', marginTop: 10 },
  fabSmall: { backgroundColor: '#444' }
});