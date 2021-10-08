import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { Platform, useWindowDimensions, Dimensions, I18nManager } from 'react-native';
import { useTheme } from '@react-navigation/native';

import UnlockWith from './UnlockWith';
import MainTabs from './screen/MainTabs'

const UnlockWithScreenStack = createStackNavigator();
const UnlockWithScreenRoot = () => (
  <UnlockWithScreenStack.Navigator name="UnlockWithScreenRoot" screenOptions={{ headerShown: false }}>
    <UnlockWithScreenStack.Screen name="UnlockWithScreen" component={UnlockWith} initialParams={{ unlockOnComponentMount: true }} />
  </UnlockWithScreenStack.Navigator>
);



const InitStack = createStackNavigator();
const InitRoot = () => (
  <InitStack.Navigator  initialRouteName="UnlockWithScreenRoot">
    <InitStack.Screen name="UnlockWithScreenRoot" component={UnlockWithScreenRoot} options={{ headerShown: false, animationEnabled: false }}/>
    <InitStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false, animationEnabled: false }}/>
  </InitStack.Navigator>
);

export default InitRoot;
