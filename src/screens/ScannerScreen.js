import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from "expo-camera";
import { IconButton, Text, Button } from 'react-native-paper';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission?.granted) return (
    <View style={styles.center}><Button onPress={requestPermission}>Enable Camera</Button></View>
  );

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;
    setScanned(true);
    try {
      await addDoc(collection(db, "books"), {
        title: "Scanned Book",
        isbn: data,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      Alert.alert("Success", `ISBN ${data} saved!`, [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (e) {
      Alert.alert("Database Error", e.message);
      setScanned(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFill} onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}>
        <View style={styles.overlay}>
          <IconButton icon="close" iconColor="white" size={30} onPress={() => navigation.goBack()} />
          <View style={styles.scannerBox} />
          <Text style={styles.hint}>Align Barcode to Save Automatically</Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 80 },
  scannerBox: { width: 280, height: 200, borderWidth: 3, borderColor: '#D4AF37', borderRadius: 20 },
  hint: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F0F' }
});