import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { List, Switch, Divider, Portal, Dialog, TextInput, Button, Text, IconButton } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { ThemeContext } from '../../App';

export default function SettingsScreen() {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [faqVisible, setFaqVisible] = useState(false);
  const [text, setText] = useState('');

  const triggerNotif = async () => {
    await Notifications.scheduleNotificationAsync({
      content: { title: "Libri Master", body: "Notifications are 100% functional!" },
      trigger: { seconds: 1 },
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const dynamicText = isDarkMode ? 'white' : 'black';

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0F0F0F' : '#F5F5F5' }]}>
      <ScrollView style={{marginTop: 40}}>
        <List.Section>
          <List.Subheader style={{color: '#D4AF37'}}>Master Controls</List.Subheader>
          <List.Item title="Dark Mode" titleStyle={{color: dynamicText}} right={() => <Switch value={isDarkMode} onValueChange={setIsDarkMode} color="#D4AF37" />} />
          <List.Item title="Push Notifications" titleStyle={{color: dynamicText}} onPress={triggerNotif} right={() => <IconButton icon="bell" iconColor="#D4AF37" />} />
        </List.Section>
        <Divider />
        <List.Section>
          <List.Subheader style={{color: '#D4AF37'}}>Support</List.Subheader>
          <List.Item title="FAQ" titleStyle={{color: dynamicText}} onPress={() => setFaqVisible(true)} left={p => <List.Icon {...p} icon="help-circle" color="#D4AF37" />} />
          <List.Item title="Feedback Box" titleStyle={{color: dynamicText}} onPress={() => setFeedbackVisible(true)} left={p => <List.Icon {...p} icon="message" color="#D4AF37" />} />
        </List.Section>
      </ScrollView>

      <Portal>
        <Dialog visible={feedbackVisible} onDismiss={() => setFeedbackVisible(false)} style={{backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF'}}>
          <Dialog.Title style={{color: dynamicText}}>Send Feedback</Dialog.Title>
          <Dialog.Content><TextInput value={text} onChangeText={setText} mode="outlined" label="Message" /></Dialog.Content>
          <Dialog.Actions><Button onPress={() => setFeedbackVisible(false)}>Cancel</Button><Button onPress={() => {setFeedbackVisible(false); Alert.alert("Success", "Feedback Sent!");}}>Send</Button></Dialog.Actions>
        </Dialog>
        
        <Dialog visible={faqVisible} onDismiss={() => setFaqVisible(false)} style={{backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF'}}>
          <Dialog.Title style={{color: dynamicText}}>FAQ</Dialog.Title>
          <Dialog.Content><Text style={{color: dynamicText}}>Scan books using the Barcode feature to auto-save data to Firebase.</Text></Dialog.Content>
          <Dialog.Actions><Button onPress={() => setFaqVisible(false)}>Close</Button></Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1 } });