/* global alert */
import React, { useState, useEffect, useContext } from 'react';
import {
  Text,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
  StatusBar,
  TextInput,
  StyleSheet,
  AppState
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BlueText,
  BlueListItem,
  PQDButton,
  BitcoinButton,
  VaultButton,
  BlueFormLabel,
  BlueButton,
  BlueButtonLink,
  BlueSpacing20,
  BlueLoading
} from '../../BlueComponents';
import navigationStyle from '../../components/navigationStyle';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useTheme, useNavigation } from '@react-navigation/native';
import loc from '../../loc';
import { BlueStorageContext } from '../../blue_modules/storage-context';
import { mnemonicGenerate } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/keyring';
import { ApiPromise, WsProvider } from '@polkadot/api';


import { PhuquocdogWallet } from '../../class/wallets/phuquocdog-wallet';


const ButtonSelected = Object.freeze({
  PQD: 'phuquocdog',
  BTC: 'btc',
  PDEX: 'pdex',
});

const WalletsAdd = () => {
  const { colors } = useTheme();
  const { addWallet, saveToDisk, isAdancedModeEnabled } = useContext(BlueStorageContext);
  const [isLoading, setIsLoading] = useState(false);

  const [walletBaseURI, setWalletBaseURI] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [label, setLabel] = useState('');
  const [isAdvancedOptionsEnabled, setIsAdvancedOptionsEnabled] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState(false);
  const { navigate, goBack } = useNavigation();
  const [entropy, setEntropy] = useState();
  const [entropyButtonText, setEntropyButtonText] = useState(loc.wallets.add_entropy_provide);
  const stylesHook = {
    advancedText: {
      color: colors.feeText,
    },
    label: {
      borderColor: colors.formBorder,
      borderBottomColor: colors.formBorder,
      backgroundColor: colors.inputBackgroundColor,
    },
    noPadding: {
      backgroundColor: colors.elevated,
    },
    root: {
      backgroundColor: colors.elevated,
    },
    lndUri: {
      borderColor: colors.formBorder,
      borderBottomColor: colors.formBorder,
      backgroundColor: colors.inputBackgroundColor,
    },
  };

  useEffect(() => {
    setWalletBaseURI('https://node.phuquoc.dog');
  });  


  const createWallet = () => {
    setIsLoading(true);
    
    if (selectedWalletType === ButtonSelected.BTC) {
        alert('We have not supported at the moment!')
        setIsLoading(false);
        return;
    }
    createWalletPQD();
  };

  const createWalletPQD = async () => {
    const provider = new WsProvider(process.env.WS || 'wss://rpc.phuquoc.dog');
    await ApiPromise.create({provider});

    const phrase = mnemonicGenerate(12);
    const keyring = new Keyring({ type: 'sr25519' });
    const {address} = keyring.addFromUri(phrase);
    const w = {
      'label': label,
      'chain': 'phuquocdog',
      'address' : address,
      'secret': phrase,
      'type': 'phuquocdog'
    }
    let pqd = new PhuquocdogWallet(w);
    addWallet(pqd);
    await saveToDisk();
    navigate('PleaseBackup', {
        walletID: address,
    });
  }

  const navigateToEntropy = () => {
    navigate('ProvideEntropy');
  };

  const navigateToImportWallet = () => {
    navigate('ImportWallet');
  };

  

  const handleOnBitcoinButtonPressed = () => {
    Keyboard.dismiss();
    setSelectedWalletType(ButtonSelected.BTC);
  };

  const handlePQDButtonPressed = () => {
    Keyboard.dismiss();
    setSelectedWalletType(ButtonSelected.PQD);
  };

  // if (isLoading) {
  //   return (
  //     <View>
  //       <BlueLoading />
  //     </View>
  //   );
  // }

  return (
    <ScrollView style={stylesHook.root}>
      <StatusBar barStyle="light-content" />
      <BlueSpacing20 />
      <KeyboardAvoidingView enabled behavior={Platform.OS === 'ios' ? 'padding' : null} keyboardVerticalOffset={62}>
        <BlueFormLabel>{loc.wallets.add_wallet_name}</BlueFormLabel>
        <View style={[styles.label, stylesHook.label]}>
          <TextInput
            testID="WalletNameInput"
            value={label}
            placeholderTextColor="#81868e"
            placeholder="my first wallet"
            onChangeText={setLabel}
            style={styles.textInputCommon}
            editable={!isLoading}
            underlineColorAndroid="transparent"
          />
        </View>
        <BlueFormLabel>{loc.wallets.add_wallet_type}</BlueFormLabel>
        <View style={styles.buttons}>

          <PQDButton
            active={selectedWalletType === ButtonSelected.PQD}
            onPress={handlePQDButtonPressed}
            style={styles.button}
          />

          <BitcoinButton
            testID="ActivateBitcoinButton"
            active={selectedWalletType === ButtonSelected.BTC}
            onPress={handleOnBitcoinButtonPressed}
            style={styles.button}
          />
          
        </View>

        <View style={styles.advanced}>
          {(() => {
            if (selectedWalletType === ButtonSelected.BTC && isAdvancedOptionsEnabled) {
              return (
                <View>
                  <BlueSpacing20 />
                  <Text style={[styles.advancedText, stylesHook.advancedText]}>{loc.settings.advanced_options}</Text>
                  <BlueListItem
                    containerStyle={[styles.noPadding, stylesHook.noPadding]}
                    bottomDivider={false}
                    onPress={() => setSelectedIndex(0)}
                    title="BTC wallets"
                    checkmark={selectedIndex === 0}
                  />
                </View>
              );
            } else if (selectedWalletType === ButtonSelected.PQD) {
              return (
                <>
                  <BlueSpacing20 />
                  <Text style={[styles.advancedText, stylesHook.advancedText]}>{loc.settings.advanced_options}</Text>
                  <BlueSpacing20 />
                  <BlueText>{loc.wallets.add_lndhub}</BlueText>
                  <View style={[styles.lndUri, stylesHook.lndUri]}>
                    <TextInput
                      value={walletBaseURI}
                      onChangeText={setWalletBaseURI}
                      onSubmitEditing={Keyboard.dismiss}
                      placeholder={loc.wallets.add_lndhub_placeholder}
                      clearButtonMode="while-editing"
                      autoCapitalize="none"
                      textContentType="URL"
                      autoCorrect={false}
                      placeholderTextColor="#81868e"
                      style={styles.textInputCommon}
                      editable={!isLoading}
                      underlineColorAndroid="transparent"
                    />
                  </View>
                </>
              );
            }
          })()}
          {isAdvancedOptionsEnabled && selectedWalletType === ButtonSelected.BTC && !isLoading && (
            <BlueButtonLink style={styles.import} title={entropyButtonText} onPress={navigateToEntropy} />
          )}
          <BlueSpacing20 />
          <View style={styles.createButton}>
            {!isLoading ? (
              <BlueButton
                testID="Create"
                title={loc.wallets.add_create}
                disabled={!selectedWalletType}
                onPress={createWallet}
              />
            ) : (
              <ActivityIndicator />
            )}
          </View>
          {!isLoading && (
            <BlueButtonLink
              testID="ImportWallet"
              style={styles.import}
              title={loc.wallets.add_import_wallet}
              onPress={navigateToImportWallet}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

WalletsAdd.navigationOptions = navigationStyle(
  {
    closeButton: true,
    headerLeft: null,
  },
  opts => ({ ...opts, title: loc.wallets.add_title }),
);

const styles = StyleSheet.create({
  createButton: {
    flex: 1,
  },
  loading: {
    flex: 1,
    paddingTop: 20,
  },
  label: {
    flexDirection: 'row',
    borderWidth: 1,
    borderBottomWidth: 0.5,
    minHeight: 44,
    height: 44,
    marginHorizontal: 20,
    alignItems: 'center',
    marginVertical: 16,
    borderRadius: 4,
  },
  textInputCommon: {
    flex: 1,
    marginHorizontal: 8,
    color: '#81868e',
  },
  buttons: {
    flexDirection: 'column',
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 0,
    minHeight: 100,
  },
  button: {
    width: '100%',
    height: 'auto',
  },
  advanced: {
    marginHorizontal: 20,
  },
  advancedText: {
    fontWeight: '500',
  },
  lndUri: {
    flexDirection: 'row',
    borderWidth: 1,
    borderBottomWidth: 0.5,
    minHeight: 44,
    height: 44,
    alignItems: 'center',
    marginVertical: 16,
    borderRadius: 4,
  },
  import: {
    marginBottom: 0,
    marginTop: 24,
  },
  noPadding: {
    paddingHorizontal: 0,
  },
  typeMargin: {
    marginTop: 8,
  },
});

export default WalletsAdd;
