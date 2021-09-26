import 'react-native-gesture-handler'; // should be on top
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  AppState,
  DeviceEventEmitter,
  NativeModules,
  NativeEventEmitter,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  UIManager,
  useColorScheme,
  View,
  StatusBar,
} from 'react-native';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { navigationRef } from './NavigationService';
import * as NavigationService from './NavigationService';
import { BlueTextCentered, BlueButton, SecondButton } from './BlueComponents';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import OnAppLaunch from './class/on-app-launch';
import DeeplinkSchemaMatch from './class/deeplink-schema-match';
import loc from './loc';
import { BlueDefaultTheme, BlueDarkTheme, BlueCurrentTheme } from './components/themes';
import BottomModal from './components/BottomModal';
import InitRoot from './Navigation';
import BlueClipboard from './blue_modules/clipboard';
import { isDesktop } from './blue_modules/environment';
import { BlueStorageContext } from './blue_modules/storage-context';
import DeviceQuickActions from './class/quick-actions';
import Notifications from './blue_modules/notifications';
import Biometric from './class/biometrics';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const eventEmitter = new NativeEventEmitter(NativeModules.EventEmitter);

const ClipboardContentType = Object.freeze({
  BITCOIN: 'BITCOIN',
  LIGHTNING: 'LIGHTNING',
});

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const App = () => {
  const { walletsInitialized, wallets, addWallet, saveToDisk, fetchAndSaveWalletTransactions, refreshAllWalletTransactions } = useContext(
    BlueStorageContext,
  );
  const appState = useRef(AppState.currentState);
  const [isClipboardContentModalVisible, setIsClipboardContentModalVisible] = useState(false);
  const [clipboardContentType, setClipboardContentType] = useState();
  const clipboardContent = useRef();
  const colorScheme = useColorScheme();
  const stylesHook = StyleSheet.create({
    modalContent: {
      backgroundColor: colorScheme === 'dark' ? BlueDarkTheme.colors.elevated : BlueDefaultTheme.colors.elevated,
    },
  });

  const onNotificationReceived = async notification => {
    const payload = Object.assign({}, notification, notification.data);
    if (notification.data && notification.data.data) Object.assign(payload, notification.data.data);
    payload.foreground = true;

    //await Notifications.addNotification(payload);
    // if user is staring at the app when he receives the notification we process it instantly
    // so app refetches related wallet
    if (payload.foreground) await processPushNotifications();
  };

  const openSettings = () => {
    NavigationService.dispatch(
      CommonActions.navigate({
        name: 'Settings',
      }),
    );
  };

  useEffect(() => {
    if (walletsInitialized) {
      addListeners();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletsInitialized]);

  useEffect(() => {
    return () => {
      Linking.removeEventListener('url', handleOpenURL);
      //AppState.removeEventListener('change', handleAppStateChange);
      eventEmitter.removeAllListeners('onNotificationReceived');
      eventEmitter.removeAllListeners('openSettings');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (colorScheme) {
      BlueCurrentTheme.updateColorScheme();
      if (colorScheme === 'light') {
        changeNavigationBarColor(BlueDefaultTheme.colors.background, true, true);
      } else {
        changeNavigationBarColor(BlueDarkTheme.colors.buttonBackgroundColor, false, true);
      }
    }
  }, [colorScheme]);

  const addListeners = () => {
    Linking.addEventListener('url', handleOpenURL);
    AppState.addEventListener('change', handleAppStateChange);
    DeviceEventEmitter.addListener('quickActionShortcut', walletQuickActions);
    DeviceQuickActions.popInitialAction().then(popInitialAction);
    handleAppStateChange(undefined);
    /*
      When a notification on iOS is shown while the app is on foreground;
      On willPresent on AppDelegate.m
     */
    eventEmitter.addListener('onNotificationReceived', onNotificationReceived);
    eventEmitter.addListener('openSettings', openSettings);
  };

  const popInitialAction = async data => {
    if (data) {
      const wallet = wallets.find(wallet => wallet.getID() === data.userInfo.url.split('wallet/')[1]);
      NavigationService.dispatch(
        CommonActions.navigate({
          name: 'WalletTransactions',
          key: `WalletTransactions-${wallet.getID()}`,
          params: {
            walletID: wallet.getID(),
            walletType: wallet.type,
          },
        }),
      );
    } else {
      const url = await Linking.getInitialURL();
      if (url) {
        handleOpenURL({ url });
      } else {
        const isViewAllWalletsEnabled = await OnAppLaunch.isViewAllWalletsEnabled();
        if (!isViewAllWalletsEnabled) {
          const selectedDefaultWallet = await OnAppLaunch.getSelectedDefaultWallet();
          const wallet = wallets.find(wallet => wallet.getID() === selectedDefaultWallet.getID());
          if (wallet) {
            NavigationService.dispatch(
              CommonActions.navigate({
                name: 'WalletTransactions',
                key: `WalletTransactions-${wallet.getID()}`,
                params: {
                  walletID: wallet.getID(),
                  walletType: wallet.type,
                },
              }),
            );
          }
        }
      }
    }
  };

  const walletQuickActions = data => {
    const wallet = wallets.find(wallet => wallet.getID() === data.userInfo.url.split('wallet/')[1]);
    NavigationService.dispatch(
      CommonActions.navigate({
        name: 'WalletTransactions',
        key: `WalletTransactions-${wallet.getID()}`,
        params: {
          walletID: wallet.getID(),
          walletType: wallet.type,
        },
      }),
    );
  };

  /**
   * Processes push notifications stored in AsyncStorage. Might navigate to some screen.
   *
   * @returns {Promise<boolean>} returns TRUE if notification was processed _and acted_ upon, i.e. navigation happened
   * @private
   */
  const processPushNotifications = async () => {
    // if we are here - we did not act upon any push
    return false;
  };

  const handleAppStateChange = async nextAppState => {
    return;
  };

  const handleOpenURL = event => {
    DeeplinkSchemaMatch.navigationRouteFor(event, value => NavigationService.navigate(...value), { wallets, addWallet, saveToDisk });
  };

  const hideClipboardContentModal = () => {
    setIsClipboardContentModalVisible(false);
  };

  const renderClipboardContentModal = () => {
    return (
      <BottomModal
        onModalShow={() => ReactNativeHapticFeedback.trigger('impactLight', { ignoreAndroidSystemSettings: false })}
        isVisible={isClipboardContentModalVisible}
        onClose={hideClipboardContentModal}
      >
        <KeyboardAvoidingView enabled={!Platform.isPad} behavior={Platform.OS === 'ios' ? 'position' : null}>
          <View style={[styles.modalContent, stylesHook.modalContent]}>
            <BlueTextCentered>
              {clipboardContentType === ClipboardContentType.BITCOIN && loc.wallets.clipboard_bitcoin}
              {clipboardContentType === ClipboardContentType.LIGHTNING && loc.wallets.clipboard_lightning}
            </BlueTextCentered>
            <View style={styles.modelContentButtonLayout}>
              <SecondButton noMinWidth title={loc._.cancel} onPress={hideClipboardContentModal} />
              <View style={styles.space} />
              <BlueButton
                noMinWidth
                title={loc._.ok}
                onPress={async () => {
                  setIsClipboardContentModalVisible(false);
                  const clipboard = await BlueClipboard.getClipboardContent();
                  setTimeout(() => handleOpenURL({ url: clipboard }), 100);
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </BottomModal>
    );
  };
  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
        <NavigationContainer ref={navigationRef} theme={colorScheme === 'dark' ? BlueDarkTheme : BlueDefaultTheme}>
          <InitRoot />
          <Notifications onProcessNotifications={processPushNotifications} />
          {renderClipboardContentModal()}
        </NavigationContainer>
        {walletsInitialized && !isDesktop}
      </View>
      <DeviceQuickActions />
      <Biometric />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  space: {
    marginHorizontal: 8,
  },
  modalContent: {
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    minHeight: 200,
    height: 200,
  },
  modelContentButtonLayout: {
    flexDirection: 'row',
    margin: 16,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
});

export default App;
