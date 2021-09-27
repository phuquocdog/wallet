/* eslint react/prop-types: "off", react-native/no-inline-styles: "off" */
import React, { Component, useState, useMemo, useCallback, useContext, useRef, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input, Text, Header, ListItem, Avatar } from 'react-native-elements';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  PixelRatio,
  Platform,
  PlatformColor,
  SafeAreaView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  InteractionManager,
  I18nManager,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';
import * as NavigationService from '../NavigationService';
import WalletGradient from '../class/wallet-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useTheme } from '@react-navigation/native';
import { BlueCurrentTheme } from './themes';
import loc, { formatBalance, formatStringAddTwoWhiteSpaces, formatBalanceWithoutSuffix, transactionTimeToReadable } from '../loc';
import Lnurl from '../class/lnurl';
import { BlueStorageContext } from '../blue_modules/storage-context';
import ToolTipMenu from './TooltipMenu';
import TransactionPendingIcon from './TransactionPendingIcon';
import { BlueButton, BlueCard, BlueListItem, BlueSpacing20, BlueTextCentered } from '../BlueComponents';

export const TransactionListItem = React.memo(({ item, itemPriceUnit = 'PQD', timeElapsed }) => {
  const [subtitleNumberOfLines, setSubtitleNumberOfLines] = useState(1);
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const { txMetadata, wallets, preferredFiatCurrency, language } = useContext(BlueStorageContext);
  const containerStyle = useMemo(
    () => ({
      backgroundColor: 'transparent',
      borderBottomColor: colors.lightBorder,
      paddingTop: 16,
      paddingBottom: 16,
      paddingRight: 0,
    }),
    [colors.lightBorder],
  );
  const toolTip = useRef();
  const copyToolTip = useRef();
  const listItemRef = useRef();

  const title = useMemo(() => {
    if (item.confirmations === 0) {
      return loc.transactions.pending;
    } else {
      return transactionTimeToReadable(item.received);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.confirmations, item.received, language]);
  const txMemo = txMetadata[item.hash]?.memo ?? '';
  const subtitle = useMemo(() => {
    let sub = item.confirmations < 7 ? loc.formatString(loc.transactions.list_conf, { number: item.confirmations }) : '';
    if (sub !== '') sub += ' ';
    sub += txMemo;
    if (item.memo) sub += item.memo;
    return sub || null;
  }, [txMemo, item.confirmations, item.memo]);

  const rowTitle = useMemo(() => {
    if (item.type === 'user_invoice' || item.type === 'payment_request') {
      if (isNaN(item.value)) {
        item.value = '0';
      }
      const currentDate = new Date();
      const now = (currentDate.getTime() / 1000) | 0;
      const invoiceExpiration = item.timestamp + item.expire_time;

      if (invoiceExpiration > now) {
        return formatBalanceWithoutSuffix(item.value && item.value, itemPriceUnit, true).toString();
      } else if (invoiceExpiration < now) {
        if (item.ispaid) {
          return formatBalanceWithoutSuffix(item.value && item.value, itemPriceUnit, true).toString();
        } else {
          return loc.lnd.expired;
        }
      }
    } else {
      return formatBalanceWithoutSuffix(item.value && item.value, itemPriceUnit, true).toString();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, itemPriceUnit, preferredFiatCurrency]);

  const rowTitleStyle = useMemo(() => {
    let color = colors.successColor;

    if (item.type === 'user_invoice' || item.type === 'payment_request') {
      const currentDate = new Date();
      const now = (currentDate.getTime() / 1000) | 0;
      const invoiceExpiration = item.timestamp + item.expire_time;

      if (invoiceExpiration > now) {
        color = colors.successColor;
      } else if (invoiceExpiration < now) {
        if (item.ispaid) {
          color = colors.successColor;
        } else {
          color = '#9AA0AA';
        }
      }
    } else if (item.value / 100000000 < 0) {
      color = colors.foregroundColor;
    }

    return {
      color,
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'right',
      width: 96,
    };
  }, [item, colors.foregroundColor, colors.successColor]);

  const avatar = useMemo(() => {
    // is it lightning refill tx?
    if (item.category === 'receive' && item.confirmations < 3) {
      return (
        <View style={{ width: 25 }}>
          <TransactionPendingIcon />
        </View>
      );
    }

    if (item.type && item.type === 'bitcoind_tx') {
      return (
        <View style={{ width: 25 }}>
          <BlueTransactionOnchainIcon />
        </View>
      );
    }
    if (item.type === 'paid_invoice') {
      // is it lightning offchain payment?
      return (
        <View style={{ width: 25 }}>
          <BlueTransactionOffchainIcon />
        </View>
      );
    }

    if (item.type === 'user_invoice' || item.type === 'payment_request') {
      if (!item.ispaid) {
        const currentDate = new Date();
        const now = (currentDate.getTime() / 1000) | 0;
        const invoiceExpiration = item.timestamp + item.expire_time;
        if (invoiceExpiration < now) {
          return (
            <View style={{ width: 25 }}>
              <BlueTransactionExpiredIcon />
            </View>
          );
        }
      } else {
        return (
          <View style={{ width: 25 }}>
            <BlueTransactionOffchainIncomingIcon />
          </View>
        );
      }
    }

    if (!item.confirmations) {
      return (
        <View style={{ width: 25 }}>
          <TransactionPendingIcon />
        </View>
      );
    } else if (item.value < 0) {
      return (
        <View style={{ width: 25 }}>
          <BlueTransactionOutgoingIcon />
        </View>
      );
    } else {
      return (
        <View style={{ width: 25 }}>
          <BlueTransactionIncomingIcon />
        </View>
      );
    }
  }, [item]);

  useEffect(() => {
    setSubtitleNumberOfLines(1);
  }, [subtitle]);

  const onPress = useCallback(async () => {
    if (item.hash) {
      navigate('TransactionStatus', { hash: item.hash });
    } else if (item.type === 'user_invoice' || item.type === 'payment_request' || item.type === 'paid_invoice') {
      const lightningWallet = wallets.filter(wallet => wallet?.getID() === item.walletID);
      if (lightningWallet.length === 1) {
        try {
          // is it a successful lnurl-pay?
          const LN = new Lnurl(false, AsyncStorage);
          let paymentHash = item.payment_hash;
          if (typeof paymentHash === 'object') {
            paymentHash = Buffer.from(paymentHash.data).toString('hex');
          }
          const loaded = await LN.loadSuccessfulPayment(paymentHash);
          if (loaded) {
            NavigationService.navigate('ScanLndInvoiceRoot', {
              screen: 'LnurlPaySuccess',
              params: {
                paymentHash,
                justPaid: false,
                fromWalletID: lightningWallet[0].getID(),
              },
            });
            return;
          }
        } catch (e) {
          console.log(e);
        }

        navigate('LNDViewInvoice', {
          invoice: item,
          walletID: lightningWallet[0].getID(),
          isModal: false,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, wallets]);

  const onLongPress = useCallback(() => {
    toolTip.current.showMenu();
  }, []);

  const handleOnExpandNote = useCallback(() => {
    setSubtitleNumberOfLines(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtitle]);

  const subtitleProps = useMemo(() => ({ numberOfLines: subtitleNumberOfLines }), [subtitleNumberOfLines]);
  const handleOnCopyTap = useCallback(() => {
    toolTip.current.hideMenu();
    setTimeout(copyToolTip.current.showMenu, 205);
  }, []);
  const handleOnCopyAmountTap = useCallback(() => Clipboard.setString(rowTitle.replace(/[\s\\-]/g, '')), [rowTitle]);
  const handleOnCopyTransactionID = useCallback(() => Clipboard.setString(item.hash), [item.hash]);
  const handleOnCopyNote = useCallback(() => Clipboard.setString(subtitle), [subtitle]);
  const handleOnViewOnBlockExplorer = useCallback(() => {
    const url = `https://mempool.space/tx/${item.hash}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  }, [item.hash]);
  const handleCopyOpenInBlockExplorerPress = useCallback(() => {
    Clipboard.setString(`https://mempool.space/tx/${item.hash}`);
  }, [item.hash]);
  const toolTipActions = useMemo(() => {
    const actions = [
      {
        id: 'copy',
        text: loc.transactions.details_copy,
        onPress: handleOnCopyTap,
      },
    ];
    if (item.hash) {
      actions.push({
        id: 'open_in_blockExplorer',
        text: loc.transactions.details_show_in_block_explorer,
        onPress: handleOnViewOnBlockExplorer,
      });
    }
    if (subtitle && subtitleNumberOfLines === 1) {
      actions.push({
        id: 'expandNote',
        text: loc.transactions.expand_note,
        onPress: handleOnExpandNote,
      });
    }
    return actions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.hash, subtitle, rowTitle, subtitleNumberOfLines, txMetadata]);

  const copyToolTipActions = useMemo(() => {
    const actions = [];
    if (rowTitle !== loc.lnd.expired) {
      actions.push({
        id: 'copyAmount',
        text: loc.send.create_amount,
        onPress: handleOnCopyAmountTap,
      });
    }

    if (item.hash) {
      actions.push(
        {
          id: 'copyTX_ID',
          text: loc.transactions.txid,
          onPress: handleOnCopyTransactionID,
        },
        {
          id: 'copy_blockExplorer',
          text: loc.transactions.block_explorer_link,
          onPress: handleCopyOpenInBlockExplorerPress,
        },
      );
    }
    if (subtitle) {
      actions.push({
        id: 'copyNote',
        text: loc.transactions.note,
        onPress: handleOnCopyNote,
      });
    }
    return actions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolTipActions]);

  return (
    <TouchableWithoutFeedback ref={listItemRef}>
      <View style={{ marginHorizontal: 4 }}>
        <ToolTipMenu ref={toolTip} anchorRef={listItemRef} actions={toolTipActions} />
        <ToolTipMenu ref={copyToolTip} anchorRef={listItemRef} actions={copyToolTipActions} />
        <BlueListItem
          leftAvatar={avatar}
          title={title}
          subtitleNumberOfLines={subtitleNumberOfLines}
          subtitle={subtitle}
          subtitleProps={subtitleProps}
          onPress={onPress}
          chevron={false}
          Component={TouchableOpacity}
          rightTitle={rowTitle}
          rightTitleStyle={rowTitleStyle}
          containerStyle={containerStyle}
          onLongPress={onLongPress}
        />
      </View>
    </TouchableWithoutFeedback>
  );
});