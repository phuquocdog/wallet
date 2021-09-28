import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'



import Soon from '../Soon';


const Tab = createMaterialTopTabNavigator();

const AppTabs = () => {

  return (
    <Tab.Navigator
        tabBarOptions={{
          labelStyle: { textTransform: 'capitalize' },
          indicatorStyle: {
            width: '15%',
            backgroundColor: 'black',
            left: '17.5%'
          }
        }}>
        <Tab.Screen component={StorageUser} name="Storage" />
        <Tab.Screen component={IpfsUser} name="IPFS" />
        <Tab.Screen component={Merchant} name="Merchant" />
        <Tab.Screen component={StorageUser} name="Order" />

      </Tab.Navigator>
  )
  
}


const Stack = createStackNavigator()

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Soon" component={Soon} options={{ headerShown: false }}/>
    </Stack.Navigator>
  )
}
