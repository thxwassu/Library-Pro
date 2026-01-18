import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, Button } from 'react-native-paper';
import { auth } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';

export default function ProfileScreen() {
  const user = auth.currentUser;
  return (
    <View style={styles.container}>
      <Avatar.Text size={100} label={user?.displayName?.[0] || 'U'} style={{backgroundColor: '#D4AF37'}} />
      <Text variant="headlineSmall" style={{marginTop: 20, color: 'white'}}>{user?.displayName || 'User'}</Text>
      <Text variant="bodyLarge" style={{color: '#aaa'}}>{user?.email}</Text>
      <Button mode="contained" icon="logout" onPress={() => signOut(auth)} style={styles.btn}>Logout</Button>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F', alignItems: 'center', justifyContent: 'center' },
  btn: { marginTop: 40, backgroundColor: '#CF6679' }
});