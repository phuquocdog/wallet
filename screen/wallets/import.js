import React, { useContext, useEffect, useState } from 'react';
import { Platform, View, Keyboard, StatusBar, StyleSheet, Alert,ActivityIndicator } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import {
  BlueFormMultiInput,
  BlueButtonLink,
  BlueFormLabel,
  BlueDoneAndDismissKeyboardInputAccessory,
  BlueButton,
  SafeBlueArea,
  BlueSpacing20,
} from '../../BlueComponents';
import navigationStyle from '../../components/navigationStyle';
import loc from '../../loc';
import { BlueStorageContext } from '../../blue_modules/storage-context';

import { PhuquocdogWallet } from '../../class/wallets/phuquocdog-wallet';
import { Keyring } from '@polkadot/keyring';
import { ApiPromise, WsProvider } from '@polkadot/api';



const WalletsImport = () => {
  const [isToolbarVisibleForAndroid, setIsToolbarVisibleForAndroid] = useState(false);
  const route = useRoute();
  const {addWallet,saveToDisk} = useContext(BlueStorageContext);
  const label = (route.params && route.params.label) || '';
  const triggerImport = (route.params && route.params.triggerImport) || false;
  const [importText, setImportText] = useState(label);
  const navigation = useNavigation();
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const styles = StyleSheet.create({
    root: {
      paddingTop: 40,
      backgroundColor: colors.elevated,
    },
    center: {
      flex: 1,
      marginHorizontal: 16,
      backgroundColor: colors.elevated,
    },
  });

  const importButtonPressed = () => {
    setIsLoading(true);
    if (importText.split(" ").filter((x) => x !== "").length < 11) {
      return;
    }
    importMnemonic(importText);
  };

  /**
   *
   * @param importText
   */
  const importMnemonic = async importText => {
    setIsLoading(true);
    try {
      const provider = new WsProvider(process.env.WS || 'wss://rpc.phuquoc.dog');
      await ApiPromise.create({provider});
      const keyring = new Keyring({ type: 'sr25519' });
      const { address } = keyring.createFromUri(importText);

      const w = {
        'label': label,
        'chain': 'phuquocdog',
        'address' : address,
        'secret': importText,
        'type': 'phuquocdog'
      }
      let pqd = new PhuquocdogWallet(w);
      addWallet(pqd);
      await saveToDisk();
      navigation.popToTop();

    } catch (error) {
      console.log(error);
      ReactNativeHapticFeedback.trigger('notificationError', { ignoreAndroidSystemSettings: false });
    }
  };

  /**
   *
   * @param value
   */
  const onBarScanned = value => {
    if (value && value.data) value = value.data + ''; // no objects here, only strings
    setImportText(value);
    setTimeout(() => importMnemonic(value), 500);
  };

  const importScan = () => {
    navigation.navigate('ScanQRCodeRoot', {
      screen: 'ScanQRCode',
      params: {
        launchedBy: route.name,
        onBarScanned: onBarScanned,
        showFileImportButton: true,
      },
    });
  };

  return (
    <SafeBlueArea style={styles.root}>
      <StatusBar barStyle="light-content" />
      <BlueSpacing20 />
      <BlueFormLabel>{loc.wallets.import_explanation}</BlueFormLabel>
      <BlueSpacing20 />
      <BlueFormMultiInput
        testID="MnemonicInput"
        value={importText}
        onChangeText={setImportText}
        inputAccessoryViewID={BlueDoneAndDismissKeyboardInputAccessory.InputAccessoryViewID}
      />

      <BlueSpacing20 />
      <View style={styles.center}>

        <>
          { !isLoading ?<BlueButton
            testID="DoImport"
            disabled={importText.trim().length === 0}
            title={loc.wallets.import_do_import}
            onPress={importButtonPressed}
          /> :

          <ActivityIndicator />

          }
          <BlueSpacing20 />
          <BlueButtonLink title={loc.wallets.import_scan_qr} onPress={importScan} testID="ScanImport" />
        </>
      </View>
      {Platform.select({
        ios: (
          <BlueDoneAndDismissKeyboardInputAccessory
            onClearTapped={() => {
              setImportText('');
            }}
            onPasteTapped={text => {
              setImportText(text);
              Keyboard.dismiss();
            }}
          />
        ),
        android: isToolbarVisibleForAndroid && (
          <BlueDoneAndDismissKeyboardInputAccessory
            onClearTapped={() => {
              setImportText('');
              Keyboard.dismiss();
            }}
            onPasteTapped={text => {
              setImportText(text);
              Keyboard.dismiss();
            }}
          />
        ),
      })}
    </SafeBlueArea>
  );
};

WalletsImport.navigationOptions = navigationStyle({}, opts => ({ ...opts, title: loc.wallets.import_title }));

export default WalletsImport;
