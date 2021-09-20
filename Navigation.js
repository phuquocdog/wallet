import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Platform, useWindowDimensions, Dimensions, I18nManager } from 'react-native';
import { useTheme } from '@react-navigation/native';

import Settings from './screen/settings/settings';
import About from './screen/settings/about';
import ReleaseNotes from './screen/settings/releasenotes';
import Licensing from './screen/settings/licensing';
import Language from './screen/settings/language';
import Currency from './screen/settings/currency';
import EncryptStorage from './screen/settings/encryptStorage';
import PlausibleDeniability from './screen/plausibledeniability';
import LightningSettings from './screen/settings/lightningSettings';
import ElectrumSettings from './screen/settings/electrumSettings';
import TorSettings from './screen/settings/torSettings';
import Tools from './screen/settings/tools';
import GeneralSettings from './screen/settings/GeneralSettings';
import NetworkSettings from './screen/settings/NetworkSettings';
import NotificationSettings from './screen/settings/notificationSettings';
import DefaultView from './screen/settings/defaultView';



import TransactionDetails from './screen/transactions/details';
import TransactionStatus from './screen/transactions/transactionStatus';
import CPFP from './screen/transactions/CPFP';
import RBFBumpFee from './screen/transactions/RBFBumpFee';
import RBFCancel from './screen/transactions/RBFCancel';


import UnlockWith from './UnlockWith';
import DrawerList from './screen/wallets/drawerList';
import { isDesktop, isTablet } from './blue_modules/environment';
import SettingsPrivacy from './screen/settings/SettingsPrivacy';
import LNDViewAdditionalInvoicePreImage from './screen/lnd/lndViewAdditionalInvoicePreImage';

import MainTabs from './screen/MainTabs'


const defaultScreenOptions =
  Platform.OS === 'ios'
    ? ({ route, navigation }) => ({
        gestureEnabled: true,
        cardOverlayEnabled: true,
        headerStatusBarHeight: navigation.dangerouslyGetState().routes.indexOf(route) > 0 ? 10 : undefined,
        ...TransitionPresets.ModalPresentationIOS,
        gestureResponseDistance: { vertical: Dimensions.get('window').height, horizontal: 50 },
      })
    : {
        gestureEnabled: true,
        cardOverlayEnabled: true,
        ...TransitionPresets.ScaleFromCenterAndroid,
      };
const defaultStackScreenOptions =
  Platform.OS === 'ios'
    ? {
        gestureEnabled: true,
        cardOverlayEnabled: true,
        headerStatusBarHeight: 10,
      }
    : {
        gestureEnabled: true,
        cardOverlayEnabled: true,
        ...TransitionPresets.ScaleFromCenterAndroid,
      };



const UnlockWithScreenStack = createStackNavigator();
const UnlockWithScreenRoot = () => (
  <UnlockWithScreenStack.Navigator name="UnlockWithScreenRoot" screenOptions={{ headerShown: false }}>
    <UnlockWithScreenStack.Screen name="UnlockWithScreen" component={UnlockWith} initialParams={{ unlockOnComponentMount: true }} />
  </UnlockWithScreenStack.Navigator>
);



const InitStack = createStackNavigator();
const InitRoot = () => (
  <InitStack.Navigator screenOptions={defaultScreenOptions} initialRouteName="UnlockWithScreenRoot">
    <InitStack.Screen name="UnlockWithScreenRoot" component={UnlockWithScreenRoot} options={{ headerShown: false, animationEnabled: false }}/>
    <InitStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false, animationEnabled: false }}/>
    <InitStack.Screen name="SettingTabs" component={Settings} options={{ headerShown: false, gestureEnabled: false }}  />
  </InitStack.Navigator>
);

export default InitRoot;
