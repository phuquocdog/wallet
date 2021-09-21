import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import { useTheme } from '@react-navigation/native';

import Soon from '../Soon';

const Stack = createStackNavigator()

export default function StakingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Soon" component={Soon} options={{ headerShown: false }}/>
    </Stack.Navigator>
  )
}
