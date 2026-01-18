import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try { await signInWithEmailAndPassword(auth, email, password); } 
    catch (e) { Alert.alert("Error", e.message); }
  };

  return (
    <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66' }} style={styles.bg}>
      <View style={styles.overlay}>
        <Text variant="displaySmall" style={styles.title}>LIBRI</Text>
        <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" style={styles.input} />
        <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry mode="outlined" style={styles.input} />
        <Button mode="contained" onPress={handleLogin} style={styles.btn}>Sign In</Button>
        <Button onPress={() => navigation.navigate('SignUp')} textColor="white">Create Account</Button>
        <Button onPress={() => email ? sendPasswordResetEmail(auth, email) : Alert.alert("Email needed")} textColor="#aaa">Forgot Password?</Button>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 25 },
  title: { color: '#D4AF37', textAlign: 'center', fontWeight: 'bold', marginBottom: 40 },
  input: { marginBottom: 15 },
  btn: { marginVertical: 10, backgroundColor: '#D4AF37' }
});