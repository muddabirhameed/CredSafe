import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import SplashScreen from './Components/SplashScreen';
import SetupAccount from './Components/SetupAccount';
import LoginScreen from './Components/LoginScreen';
import HomeScreen from './Components/HomeScreen';
import OnlineAccountDetailScreen from './Components/OnlineAccountDetailScreen';
import PasswordDetailScreen from './Components/PasswordDetailScreen';
import CryptoSeedDetailScreen from './Components/CryptoSeedDetailScreen';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="SetupAccount" component={SetupAccount} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="OnlineAccountDetail" component={OnlineAccountDetailScreen} />
          <Stack.Screen name="PasswordDetail" component={PasswordDetailScreen} />
          <Stack.Screen name="CryptoSeedDetail" component={CryptoSeedDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
