import React, { useState, useEffect, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ScannerScreen from './src/screens/ScannerScreen';

export const ThemeContext = createContext();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = isDarkMode ? {
    ...MD3DarkTheme,
    colors: { ...MD3DarkTheme.colors, primary: '#D4AF37', background: '#0F0F0F', surface: '#1E1E1E' }
  } : {
    ...MD3LightTheme,
    colors: { ...MD3LightTheme.colors, primary: '#D4AF37', background: '#F5F5F5', surface: '#FFFFFF' }
  };

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  function MainTabs() {
    return (
      <Tab.Navigator screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF', borderTopWidth: 0 },
        tabBarActiveTintColor: '#D4AF37',
        tabBarIcon: ({ color, size }) => {
          let icon = route.name === 'Home' ? 'library' : route.name === 'Dashboard' ? 'bar-chart' : route.name === 'Profile' ? 'person' : 'settings';
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    );
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
              <>
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="Scanner" component={ScannerScreen} />
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </ThemeContext.Provider>
  );
}