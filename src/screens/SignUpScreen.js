import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: name });
    } catch (e) { Alert.alert("Error", e.message); }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Register</Text>
      <TextInput label="Full Name" value={name} onChangeText={setName} mode="outlined" style={styles.input} />
      <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" style={styles.input} />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry mode="outlined" style={styles.input} />
      <Button mode="contained" onPress={handleSignUp} style={styles.btn}>Join Now</Button>
      <Button onPress={() => navigation.goBack()}>Back to Login</Button>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F', justifyContent: 'center', padding: 25 },
  title: { color: '#D4AF37', textAlign: 'center', marginBottom: 30 },
  input: { marginBottom: 15 },
  btn: { marginTop: 10, backgroundColor: '#D4AF37' }
});