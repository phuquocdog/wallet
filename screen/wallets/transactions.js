/* global alert */
import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  InteractionManager,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  PixelRatio,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  findNodeHandle,
  TouchableOpacity,
  View,
  I18nManager,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Icon } from 'react-native-elements';
import { useRoute, useNavigation, useTheme, useFocusEffect } from '@react-navigation/native';
import { BlueTransactionListItem, BlueWalletNavigationHeader, BlueAlertWalletExportReminder, BlueListItem } from '../../BlueComponents';
import WalletGradient from '../../class/wallet-gradient';
import navigationStyle from '../../components/navigationStyle';
import ActionSheet from '../ActionSheet';
import loc from '../../loc';
import { FContainer, FButton } from '../../components/FloatButtons';
import BottomModal from '../../components/BottomModal';
import { BlueStorageContext } from '../../blue_modules/storage-context';
import { isDesktop, isMacCatalina } from '../../blue_modules/environment';
import BlueClipboard from '../../blue_modules/clipboard';


const fs = require('../../blue_modules/fs');
const LocalQRCode = require('@remobile/react-native-qrcode-local-image');


const buttonFontSize =
  PixelRatio.roundToNearestPixel(Dimensions.get('window').width / 26) > 22
    ? 22
    : PixelRatio.roundToNearestPixel(Dimensions.get('window').width / 26);

const WalletTransactions = ({navigation}) => {
  const { wallets, saveToDisk, setSelectedWallet, walletTransactionUpdateStatus } = useContext(BlueStorageContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isManageFundsModalVisible, setIsManageFundsModalVisible] = useState(false);
  const { walletID } = useRoute().params;
  const { name } = useRoute();
  const wallet = wallets.find(w => w.getID() === walletID);
  const [dataSource, setDataSource] = useState([])
  const [limit, setLimit] = useState(15);
  const { setParams, setOptions, navigate } = useNavigation();
  const { colors } = useTheme();
  const walletActionButtonsRef = useRef();

  const stylesHook = StyleSheet.create({
    advancedTransactionOptionsModalContent: {
      backgroundColor: colors.elevated,
    },
    listHeaderText: {
      color: colors.foregroundColor,
    },
    marketplaceButton1: {
      backgroundColor: colors.lightButton,
    },
    marketplaceButton2: {
      backgroundColor: colors.lightButton,
    },
    marketpalceText1: {
      color: colors.cta2,
    },
    marketpalceText2: {
      color: colors.cta2,
    },
    list: {
      backgroundColor: colors.background,
    },
  });

  /**
   * Simple wrapper for `wallet.getTransactions()`, where `wallet` is current wallet.
   * Sorts. Provides limiting.
   *
   * @param limit {Integer} How many txs return, starting from the earliest. Default: all of them.
   * @returns {Array}
   */
  const getTransactionsSliced = (limit = Infinity) => {
    return [];
  };

  useEffect(() => {
    setIsLoading(true);
    setLimit(15);
    setIsLoading(false);
    setSelectedWallet(wallet.getID());


    setOptions({
      headerStyle: {
        backgroundColor: WalletGradient.headerColorFor(wallet.getType()),
        shadowColor: 'transparent'
      },
      headerTintColor: '#fff',
      title : 'Transactions'
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
      let mounted = true
      wallet.getTransactions().then(r => {
        setDataSource(r);
      });
      return () => {      mounted = false    }
  },[]);

  const isLightning = () => {
  
    return false;
  };

  /**
   * Forcefully fetches TXs and balance for wallet
   */
  const refreshTransactions = async () => {
    console.log('refreshTransactions pull', isLoading)
    if (isLoading) return;
    setIsLoading(true);
    let noErr = true;
    let smthChanged = false;
    try {
      
      const oldBalance = await wallet.refreshTransactions();
      
    } catch (err) {
      noErr = false;
      alert(err.message);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const _keyExtractor = (_item, index) => index.toString();

  const renderListFooterComponent = () => {
    // if not all txs rendered - display indicator
    return (getTransactionsSliced(Infinity).length > limit && <ActivityIndicator style={styles.activityIndicator} />) || <View />;
  };

  const renderListHeaderComponent = () => {
    const style = {};
    if (!isDesktop) {
      // we need this button for testing
      style.opacity = 0;
      style.height = 1;
      style.width = 1;
    } else if (isLoading) {
      style.opacity = 0.5;
    } else {
      style.opacity = 1.0;
    }
    return (
      <View style={styles.flex}>
        <View style={styles.listHeader}>
        </View>
        <View style={[styles.listHeaderTextRow, stylesHook.listHeaderTextRow]}>
          <Text style={[styles.listHeaderText, stylesHook.listHeaderText]}>{loc.transactions.list_title}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            testID="refreshTransactions"
            style={style}
            onPress={refreshTransactions}
            disabled={isLoading}
          >
            <Icon name="refresh" type="font-awesome" color={colors.feeText} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const hideManageFundsModal = () => {
    Keyboard.dismiss();
    setIsManageFundsModalVisible(false);
  };




  //
  const onWalletSelect = async selectedWallet => {
    if (selectedWallet) {
      navigate('WalletTransactions', {
        walletType: wallet.getType(),
        walletID: wallet.getID(),
        key: `WalletTransactions-${wallet.getID()}`,
      });
      /** @type {LightningCustodianWallet} */
      let toAddress = false;
      if (wallet.refill_addressess.length > 0) {
        toAddress = wallet.refill_addressess[0];
      } else {
        try {
          await wallet.fetchBtcAddress();
          toAddress = wallet.refill_addressess[0];
        } catch (Err) {
          return alert(Err.message);
        }
      }
      navigate('SendDetailsRoot', {
        screen: 'SendDetails',
        params: {
          memo: loc.lnd.refill_lnd_balance,
          address: toAddress,
          walletID: selectedWallet.getID(),
        },
      });
    }
  };
  

  const renderItem = item => <BlueTransactionListItem item={item.item} />;



  const onBarCodeRead = ret => {
    console.log('Recevied')
    setIsLoading(false);
  };

  const choosePhoto = () => {
    launchImageLibrary(
      {
        title: null,
        mediaType: 'photo',
        takePhotoButtonTitle: null,
        maxHeight: 800,
        maxWidth: 600,
      },
      response => {
        if (response.uri) {
          const uri = response.uri.toString().replace('file://', '');
          LocalQRCode.decode(uri, (error, result) => {
            if (!error) {
              onBarCodeRead({ data: result });
            } else {
              alert(loc.send.qr_error_no_qrcode);
            }
          });
        }
      },
    );
  };

  const copyFromClipboard = async () => {
    onBarCodeRead({ data: await BlueClipboard.getClipboardContent() });
  };

  const sendButtonPress = () => {
    navigate('Home', {
      screen: 'SendDetails',
      params: {
        walletID: wallet.getID(),
      },
    });
  };

  const sendButtonLongPress = async () => {
    if (isMacCatalina) {
      fs.showActionSheet({ anchor: walletActionButtonsRef.current }).then(onBarCodeRead);
    } else {
      const isClipboardEmpty = (await BlueClipboard.getClipboardContent()).trim().length === 0;
      if (Platform.OS === 'ios') {
        const options = [loc._.cancel, loc.wallets.list_long_choose, loc.wallets.list_long_scan];
        if (!isClipboardEmpty) {
          options.push(loc.wallets.list_long_clipboard);
        }
        ActionSheet.showActionSheetWithOptions(
          { options, cancelButtonIndex: 0, anchor: findNodeHandle(walletActionButtonsRef.current) },
          buttonIndex => {
            if (buttonIndex === 1) {
              choosePhoto();
            } else if (buttonIndex === 2) {
              navigate('ScanQRCodeRoot', {
                screen: 'ScanQRCode',
                params: {
                  launchedBy: name,
                  onBarScanned: onBarCodeRead,
                  showFileImportButton: false,
                },
              });
            } else if (buttonIndex === 3) {
              copyFromClipboard();
            }
          },
        );
      } else if (Platform.OS === 'android') {
        const buttons = [
          {
            text: loc._.cancel,
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: loc.wallets.list_long_choose,
            onPress: choosePhoto,
          },
          {
            text: loc.wallets.list_long_scan,
            onPress: () =>
              navigate('ScanQRCodeRoot', {
                screen: 'ScanQRCode',
                params: {
                  launchedBy: name,
                  onBarScanned: onBarCodeRead,
                  showFileImportButton: false,
                },
              }),
          },
        ];
        if (!isClipboardEmpty) {
          buttons.push({
            text: loc.wallets.list_long_clipboard,
            onPress: copyFromClipboard,
          });
        }
        ActionSheet.showActionSheetWithOptions({
          title: '',
          message: '',
          buttons,
        });
      }
    }
  };

  const navigateToViewEditCosigners = () => {
    navigate('ViewEditMultisigCosignersRoot', {
      screen: 'ViewEditMultisigCosigners',
      params: {
        walletId: wallet.getID(),
      },
    });
  };

  return (
    <View style={styles.flex}>
      
      <BlueWalletNavigationHeader
        wallet={wallet}
        onManageFundsPressed={() => {
          console.log('onManageFundsPressed')
          if (wallet.getUserHasSavedExport()) {
              setIsManageFundsModalVisible(true);
            } else {
              BlueAlertWalletExportReminder({
                onSuccess: async () => {
                  wallet.setUserHasSavedExport(true);
                  await saveToDisk();
                  setIsManageFundsModalVisible(true);
                },
                onFailure: () =>
                  navigate('WalletExportRoot', {
                    screen: 'WalletExport',
                    params: {
                      walletID: wallet.getID(),
                    },
                  }),
              });
            }
        }}
      />
      <View style={[styles.list, stylesHook.list]}>
        <FlatList
          ListHeaderComponent={renderListHeaderComponent}
          onEndReachedThreshold={0.3}
          
          ListFooterComponent={renderListFooterComponent}
          ListEmptyComponent={
            <ScrollView style={styles.flex} contentContainerStyle={styles.scrollViewContent}>
              <Text numberOfLines={0} style={styles.emptyTxs}>
                {(isLightning() && loc.wallets.list_empty_txs1_lightning) || loc.wallets.list_empty_txs1}
              </Text>
              {isLightning() && <Text style={styles.emptyTxsLightning}>{loc.wallets.list_empty_txs2_lightning}</Text>}

            </ScrollView>
          }
          onRefresh={refreshTransactions}
          refreshing={isLoading}
          data={dataSource}
          extraData={[dataSource, wallets]}
          keyExtractor={_keyExtractor}
          renderItem={renderItem}
          contentInset={{ top: 0, left: 0, bottom: 90, right: 0 }}
        />
      </View>

      <FContainer ref={walletActionButtonsRef}>
        {wallet.allowReceive() && (
          <FButton
            testID="ReceiveButton"
            text={loc.receive.header}
            onPress={() => {
              navigate('Home', { screen: 'ReceiveDetails', params: { walletID: wallet.getID(), address: wallet.getAddress()} });
            }}
            icon={
              <View style={styles.receiveIcon}>
                <Icon name="arrow-down" size={buttonFontSize} type="font-awesome" color={colors.buttonAlternativeTextColor} />
              </View>
            }
          />
        )}
        {(wallet.allowSend() || (wallet.getType() === WatchOnlyWallet.type && wallet.isHd())) && (
          <FButton
            onLongPress={sendButtonLongPress}
            onPress={sendButtonPress}
            text={loc.send.header}
            testID="SendButton"
            icon={
              <View style={styles.sendIcon}>
                <Icon name="arrow-down" size={buttonFontSize} type="font-awesome" color={colors.buttonAlternativeTextColor} />
              </View>
            }
          />
        )}
      </FContainer>
    </View>
  );
};

//
export default WalletTransactions;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollViewContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    minHeight: 200,
    height: 200,
  },
  advancedTransactionOptionsModalContent: {
    padding: 22,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    minHeight: 130,
  },
  walletDetails: {
    marginHorizontal: 16,
    minWidth: 150,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  activityIndicator: {
    marginVertical: 20,
  },
  listHeader: {
    marginLeft: 16,
    marginRight: 16,
    marginVertical: 16,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  listHeaderTextRow: {
    flex: 1,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listHeaderText: {
    marginTop: 8,
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 24,
  },
  marketplaceButton1: {
    borderRadius: 9,
    minHeight: 49,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'auto',
    flexGrow: 1,
    marginHorizontal: 4,
  },
  marketplaceButton2: {
    borderRadius: 9,
    minHeight: 49,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'auto',
    flexGrow: 1,
    marginHorizontal: 4,
  },
  marketpalceText1: {
    fontSize: 18,
  },
  marketpalceText2: {
    fontSize: 18,
    marginHorizontal: 8,
  },
  list: {
    flex: 1,
  },
  emptyTxs: {
    fontSize: 18,
    color: '#9aa0aa',
    textAlign: 'center',
    marginVertical: 16,
  },
  emptyTxsLightning: {
    fontSize: 18,
    color: '#9aa0aa',
    textAlign: 'center',
    fontWeight: '600',
  },
  buyBitcoin: {
    backgroundColor: '#007AFF',
    minWidth: 260,
    borderRadius: 8,
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  buyBitcoinText: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  sendIcon: {
    transform: [{ rotate: I18nManager.isRTL ? '-225deg' : '225deg' }],
  },
  receiveIcon: {
    transform: [{ rotate: I18nManager.isRTL ? '45deg' : '-45deg' }],
  },
});
