import React, {useEffect} from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import { useTheme } from '@react-navigation/native';

import About from './about';
import Settings from './settings';
import Currency from './currency';
import SettingsPrivacy from './SettingsPrivacy';
import Language from './language';
import NetworkSettings from './NetworkSettings';
import Tools from './tools';
import EncryptStorage from './encryptStorage';
import GeneralSettings from './GeneralSettings';

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Stack = createStackNavigator()



const SettingStack = ({navigation, route}) => {
  const theme = useTheme();
  

  useEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'WalletsList';
    
    if ('WalletsList' == routeName) {
      //navigation.setOptions({ tabBarVisible: true })
    } else {
      navigation.setOptions({ tabBarVisible: false })
    }
    //return () => { mountedRef.current = false }
  }, [navigation, route])

  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={Settings} options={Settings.navigationOptions(theme)} />
      <Stack.Screen name="GeneralSettings" component={GeneralSettings}  />
      <Stack.Screen name="About" component={About} />
      <Stack.Screen name="SettingsPrivacy" component={SettingsPrivacy} />
      <Stack.Screen name="Currency" component={Currency} />
      <Stack.Screen name="Language" component={Language} />
      <Stack.Screen name="Tools" component={Tools} />
      <Stack.Screen name="NetworkSettings" component={NetworkSettings} />
      <Stack.Screen name="EncryptStorage" component={EncryptStorage} />


    </Stack.Navigator>
  )
}

export default SettingStack;
