import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  I18nManager,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import RNFS from 'react-native-fs';
import BigNumber from 'bignumber.js';

import { BlueButton, BlueDismissKeyboardInputAccessory, BlueListItem, BlueLoading } from '../../BlueComponents';
import { navigationStyleTx } from '../../components/navigationStyle';
import NetworkTransactionFees, { NetworkTransactionFee } from '../../models/networkTransactionFees';
import DocumentPicker from 'react-native-document-picker';
import loc, { formatBalance, formatBalanceWithoutSuffix } from '../../loc';
import CoinsSelected from '../../components/CoinsSelected';
import BottomModal from '../../components/BottomModal';
import AddressInput from '../../components/AddressInput';
import AmountInput from '../../components/AmountInput';
import InputAccessoryAllFunds from '../../components/InputAccessoryAllFunds';
import { BlueStorageContext } from '../../blue_modules/storage-context';
const prompt = require('../../blue_modules/prompt');
const fs = require('../../blue_modules/fs');
const scanqr = require('../../helpers/scan-qr');

const SendDetails = () => {
  const { wallets, setSelectedWallet, sleep, txMetadata, saveToDisk } = useContext(BlueStorageContext);
  const navigation = useNavigation();
  const { name, params: routeParams } = useRoute();
  const scrollView = useRef();
  const scrollIndex = useRef(0);
  const { colors } = useTheme();

  // state
  const [width, setWidth] = useState(Dimensions.get('window').width);
  const [isLoading, setIsLoading] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [walletSelectionOrCoinsSelectedHidden, setWalletSelectionOrCoinsSelectedHidden] = useState(false);
  const [isAmountToolbarVisibleForAndroid, setIsAmountToolbarVisibleForAndroid] = useState(false);
  const [isFeeSelectionModalVisible, setIsFeeSelectionModalVisible] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [isTransactionReplaceable, setIsTransactionReplaceable] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [units, setUnits] = useState([]);
  const [memo, setMemo] = useState('');
  const [networkTransactionFees, setNetworkTransactionFees] = useState(new NetworkTransactionFee(3, 2, 1));
  const [networkTransactionFeesIsLoading, setNetworkTransactionFeesIsLoading] = useState(false);
  const [customFee, setCustomFee] = useState(null);
  const [amountUnit, setAmountUnit] = useState();
  const [changeAddress, setChangeAddress] = useState();
  const [balance, setBalance] = useState('');

  const [amount, setAmount] = useState('0');
  const mountedRef = useRef(true)

  // if cutomFee is not set, we need to choose highest possible fee for wallet balance
  // if there are no funds for even Slow option, use 1 sat/byte fee
  //@TODO
  const feeRate = useMemo(() => {
    return '0.01'
  });

  
  useEffect(() => {
    const wallet = (routeParams.walletID && wallets.find(w => w.getID() === routeParams.walletID));
    setWallet(wallet);
    setBalance(wallet.balanceHuman);
    setAddresses([{ address: '', key: String(Math.random()) }]); // key is for the FlatList
    return () => {
      mountedRef.current = false;
    };
  }, [balance]); // eslint-disable-line react-hooks/exhaustive-deps

  


  const createTransaction = async () => {
    let recipients = addresses;
    navigation.navigate('SendConfirm', {
      fee:feeRate,
      memo,
      amount,
      recipients,
      walletID: wallet.getID()
    });
    setIsLoading(false);
    
  };

  

  const onWalletSelect = wallet => {
    setWallet(wallet);
    navigation.pop();
  };

  /**
   * same as `importTransaction`, but opens camera instead.
   *
   * @returns {Promise<void>}
   */
  const importQrTransaction = () => {
    if (wallet.type !== WatchOnlyWallet.type) {
      return Alert.alert(loc.errors.error, 'Error: importing transaction in non-watchonly wallet (this should never happen)');
    }

    setOptionsVisible(false);

    navigation.navigate('ScanQRCodeRoot', {
      screen: 'ScanQRCode',
      params: {
        onBarScanned: importQrTransactionOnBarScanned,
        showFileImportButton: false,
      },
    });
  };

  const importQrTransactionOnBarScanned = ret => {
    
  };

  /**
   * watch-only wallets with enabled HW wallet support have different flow. we have to show PSBT to user as QR code
   * so he can scan it and sign it. then we have to scan it back from user (via camera and QR code), and ask
   * user whether he wants to broadcast it.
   * alternatively, user can export psbt file, sign it externally and then import it
   *
   * @returns {Promise<void>}
   */
  const importTransaction = async () => {
    console.log('importTransaction');
    
  };

  const askCosignThisTransaction = async () => {
    console.log('askCosignThisTransaction');
  };

  

  const importTransactionMultisig = () => {
    console.log('importTransactionMultisig')
  };

  const onBarScanned = ret => {
    console.log('onBarScanned')
  };

  const importTransactionMultisigScanQr = () => {
    setOptionsVisible(false);
    navigation.navigate('ScanQRCodeRoot', {
      screen: 'ScanQRCode',
      params: {
        onBarScanned,
        showFileImportButton: true,
      },
    });
  };

  
  const hideOptions = () => {
    Keyboard.dismiss();
    setOptionsVisible(false);
  };

  const onReplaceableFeeSwitchValueChanged = value => {
    setIsTransactionReplaceable(value);
  };

  

  const onUseAllPressed = () => {
    ReactNativeHapticFeedback.trigger('notificationWarning');
  };


  const stylesHook = StyleSheet.create({
    loading: {
      backgroundColor: colors.background,
    },
    root: {
      backgroundColor: colors.elevated,
    },
    modalContent: {
      backgroundColor: colors.modal,
      borderTopColor: colors.borderTopColor,
      borderWidth: colors.borderWidth,
    },
    optionsContent: {
      backgroundColor: colors.modal,
      borderTopColor: colors.borderTopColor,
      borderWidth: colors.borderWidth,
    },
    feeModalItemActive: {
      backgroundColor: colors.feeActive,
    },
    feeModalLabel: {
      color: colors.successColor,
    },
    feeModalTime: {
      backgroundColor: colors.successColor,
    },
    feeModalTimeText: {
      color: colors.background,
    },
    feeModalValue: {
      color: colors.successColor,
    },
    feeModalCustomText: {
      color: colors.buttonAlternativeTextColor,
    },
    selectLabel: {
      color: colors.buttonTextColor,
    },
    of: {
      color: colors.feeText,
    },
    memo: {
      borderColor: colors.formBorder,
      borderBottomColor: colors.formBorder,
      backgroundColor: colors.inputBackgroundColor,
    },
    feeLabel: {
      color: colors.feeText,
    },
    feeRow: {
      backgroundColor: colors.feeLabel,
    },
    feeValue: {
      color: colors.feeValue,
    },
  });

  const renderFeeSelectionModal = () => {

    let fee = feeRate;
    const nf = networkTransactionFees;
    const options = [
      {
        label: loc.send.fee_fast,
        time: loc.send.fee_10m,
        fee: fee,
        rate: nf.fastestFee,
        active: Number(feeRate) === nf.fastestFee,
      },
      {
        label: loc.send.fee_medium,
        time: loc.send.fee_3h,
        fee: fee,
        rate: nf.mediumFee,
        active: Number(feeRate) === nf.mediumFee,
      },
      {
        label: loc.send.fee_slow,
        time: loc.send.fee_1d,
        fee: fee,
        rate: nf.slowFee,
        active: Number(feeRate) === nf.slowFee,
      },
    ];

    return (
      <BottomModal
        deviceWidth={width + width / 2}
        isVisible={isFeeSelectionModalVisible}
        onClose={() => setIsFeeSelectionModalVisible(false)}
      >
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'position' : null}>
          <View style={[styles.modalContent, stylesHook.modalContent]}>
            {options.map(({ label, time, fee, rate, active }, index) => (
              <TouchableOpacity
                accessibilityRole="button"
                key={label}
                onPress={() => {
                  setIsFeeSelectionModalVisible(false);
                  setCustomFee(rate.toString());
                }}
                style={[styles.feeModalItem, active && styles.feeModalItemActive, active && stylesHook.feeModalItemActive]}
              >
                <View style={styles.feeModalRow}>
                  <Text style={[styles.feeModalLabel, stylesHook.feeModalLabel]}>{label}</Text>
                  <View style={[styles.feeModalTime, stylesHook.feeModalTime]}>
                    <Text style={stylesHook.feeModalTimeText}>~{time}</Text>
                  </View>
                </View>
                <View style={styles.feeModalRow}>
                  <Text style={stylesHook.feeModalValue}>{fee}</Text>
                  <Text style={stylesHook.feeModalValue}>
                    {rate} {loc.units.sat_byte}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              testID="feeCustom"
              accessibilityRole="button"
              style={styles.feeModalCustom}
              onPress={async () => {
                let error = loc.send.fee_satbyte;
                while (true) {
                  let fee;

                  try {
                    fee = await prompt(loc.send.create_fee, error, true, 'numeric');
                  } catch (_) {
                    return;
                  }

                  if (!/^\d+$/.test(fee)) {
                    error = loc.send.details_fee_field_is_not_valid;
                    continue;
                  }

                  if (fee < 1) fee = '1';
                  fee = Number(fee).toString(); // this will remove leading zeros if any
                  setCustomFee(fee);
                  setIsFeeSelectionModalVisible(false);
                  return;
                }
              }}
            >
              <Text style={[styles.feeModalCustomText, stylesHook.feeModalCustomText]}>{loc.send.fee_custom}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </BottomModal>
    );
  };
  const processAddressData = () => {
    console.log('processAddressData')
  }


  const renderCreateButton = () => {
    return (
      <View style={styles.createButton}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <BlueButton onPress={createTransaction} title={loc.send.details_next} testID="CreateTransactionButton" />
        )}
      </View>
    );
  };

  // 
  const renderBitcoinTransactionInfoFields = params => {
    const { item, index } = params;

    return (
      <View style={{ width }} testID={'Transaction' + index}>
        <AmountInput
          isLoading={isLoading}
          amount={item.amount ? item.amount.toString() : null}
          onChangeText={text => {
            setAddresses(addresses => {
              item.amount = text;
              item.amountSats = parseInt(text);
              addresses[index] = item;
              return [...addresses];
            });
            setAmount(text)
          }}

          unit={units[index] || amountUnit}
          inputAccessoryViewID={InputAccessoryAllFunds.InputAccessoryViewID}
        />
        <AddressInput
          onChangeText={text => {
            text = text.trim();

            setAddresses(addresses => {
              item.address = text;
              item.amount = item.amount;
              addresses[index] = item;
              return [...addresses];
            });
            setMemo(memo);
          }}
          onBarScanned={processAddressData}
          address={item.address}
          isLoading={isLoading}
          inputAccessoryViewID={BlueDismissKeyboardInputAccessory.InputAccessoryViewID}
          launchedBy={name}
        />
        {addresses.length > 1 && (
          <Text style={[styles.of, stylesHook.of]}>{loc.formatString(loc._.of, { number: index + 1, total: addresses.length })}</Text>
        )}
      </View>
    );
  };

  if (isLoading || !wallet) {
    return (
      <View style={[styles.loading, stylesHook.loading]}>
        <BlueLoading />
      </View>
    );
  }

  const allBalance = balance
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.root, stylesHook.root]} onLayout={e => setWidth(e.nativeEvent.layout.width)}>
        <StatusBar barStyle="light-content" />
        <View>
          <KeyboardAvoidingView behavior="position">
            <FlatList
              keyboardShouldPersistTaps="always"
              scrollEnabled={addresses.length > 1}
              data={addresses}
              renderItem={renderBitcoinTransactionInfoFields}
              ref={scrollView}
              horizontal
              pagingEnabled
              removeClippedSubviews={false}
              onMomentumScrollBegin={Keyboard.dismiss}
              scrollEventThrottle={200}
              scrollIndicatorInsets={styles.scrollViewIndicator}
              contentContainerStyle={styles.scrollViewContent}
            />
            <View style={[styles.memo, stylesHook.memo]}>
              <TextInput
                onChangeText={text => setMemo(text)}
                placeholder={loc.send.details_note_placeholder}
                placeholderTextColor="#81868e"
                value={memo}
                numberOfLines={1}
                style={styles.memoText}
                editable={!isLoading}
                onSubmitEditing={Keyboard.dismiss}
                inputAccessoryViewID={BlueDismissKeyboardInputAccessory.InputAccessoryViewID}
              />
            </View>
            <TouchableOpacity
              testID="chooseFee"
              accessibilityRole="button"
              onPress={() => setIsFeeSelectionModalVisible(true)}
              disabled={isLoading}
              style={styles.fee}
            >
              <Text style={[styles.feeLabel, stylesHook.feeLabel]}>{loc.send.create_fee}</Text>

              {networkTransactionFeesIsLoading ? (
                <ActivityIndicator />
              ) : (
                <View style={[styles.feeRow, stylesHook.feeRow]}>
                  <Text style={stylesHook.feeValue}>
                    0.01 PQD
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            {renderCreateButton()}
            {renderFeeSelectionModal()}
          </KeyboardAvoidingView>
        </View>
        <BlueDismissKeyboardInputAccessory />
        {Platform.select({
          ios: <InputAccessoryAllFunds canUseAll={balance > 0} onUseAllPressed={onUseAllPressed} balance={allBalance} />,
          android: isAmountToolbarVisibleForAndroid && (
            <InputAccessoryAllFunds canUseAll={balance > 0} onUseAllPressed={onUseAllPressed} balance={allBalance} />
          ),
        })}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SendDetails;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    paddingTop: 20,
  },
  root: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollViewContent: {
    flexDirection: 'row',
  },
  scrollViewIndicator: {
    top: 0,
    left: 8,
    bottom: 0,
    right: 8,
  },
  modalContent: {
    padding: 22,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: 200,
  },
  optionsContent: {
    padding: 22,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: 130,
  },
  feeModalItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 10,
  },
  feeModalItemActive: {
    borderRadius: 8,
  },
  feeModalRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeModalLabel: {
    fontSize: 22,
    fontWeight: '600',
  },
  feeModalTime: {
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  feeModalCustom: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feeModalCustomText: {
    fontSize: 15,
    fontWeight: '600',
  },
  createButton: {
    marginVertical: 16,
    marginHorizontal: 16,
    alignContent: 'center',
    minHeight: 44,
  },
  select: {
    marginBottom: 24,
    marginHorizontal: 24,
    alignItems: 'center',
  },
  selectTouch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectText: {
    color: '#9aa0aa',
    fontSize: 14,
    marginRight: 8,
  },
  selectWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  selectLabel: {
    fontSize: 14,
  },
  of: {
    alignSelf: 'flex-end',
    marginRight: 18,
    marginVertical: 8,
  },
  memo: {
    flexDirection: 'row',
    borderWidth: 1,
    borderBottomWidth: 0.5,
    minHeight: 44,
    height: 44,
    marginHorizontal: 20,
    alignItems: 'center',
    marginVertical: 8,
    borderRadius: 4,
  },
  memoText: {
    flex: 1,
    marginHorizontal: 8,
    minHeight: 33,
    color: '#81868e',
  },
  fee: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeLabel: {
    fontSize: 14,
  },
  feeRow: {
    minWidth: 40,
    height: 25,
    borderRadius: 4,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  advancedOptions: {
    minWidth: 40,
    height: 40,
    justifyContent: 'center',
  },
});
