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
import { BlurView } from '@react-native-community/blur';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useTheme } from '@react-navigation/native';
import { BlueCurrentTheme } from './themes';
import loc, { formatBalance, formatStringAddTwoWhiteSpaces, formatBalanceWithoutSuffix, transactionTimeToReadable } from '../loc';
import Lnurl from '../class/lnurl';
import { BlueStorageContext } from '../blue_modules/storage-context';
import ToolTipMenu from './TooltipMenu';

export const TransactionPendingIcon = props => {
  const { colors } = useTheme();

  const stylesBlueIconHooks = StyleSheet.create({
    ball: {
      backgroundColor: colors.buttonBackgroundColor,
    },
  });
  return (
    <View {...props}>
      <View style={stylesBlueIcon.boxIncoming}>
        <View style={[stylesBlueIcon.ball, stylesBlueIconHooks.ball]}>
          <Icon
            {...props}
            name="kebab-horizontal"
            size={16}
            type="octicon"
            color={colors.foregroundColor}
            iconStyle={{ left: 0, top: 7 }}
          />
        </View>
      </View>
    </View>
  );
};