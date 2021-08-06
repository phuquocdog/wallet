import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
// import * as Sentry from '@sentry/react-native'
// import { useSelector } from 'react-redux'
// import { AuthSelectors } from 'src/reducers/AuthReducer'
// import Login from './MainNative/Login'
//import Welcome from './MainNative/Welcome'
// import Join from './MainNative/Join'
// import ForgotPasswordScreen from './MainNative/ForgotPasswordScreen'
//import ProcessingScreen from './MainNative/ProcessingScreen'
//import MainNavigator from './MainNavigator'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

export default function AppContainer() {
  

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
