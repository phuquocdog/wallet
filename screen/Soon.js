import React from 'react';
import { TouchableOpacity, ScrollView, Linking, Image, View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { getApplicationName, getVersion, getBundleId, getBuildNumber, getUniqueId } from 'react-native-device-info';
import Rate, { AndroidMarket } from 'react-native-rate';

import { BlueButton, BlueCard, BlueListItem, BlueSpacing20, BlueTextCentered } from '../../BlueComponents';
import loc, { formatStringAddTwoWhiteSpaces } from '../../loc';
import Clipboard from '@react-native-clipboard/clipboard';

const Soon = () => {
  const { navigate } = useNavigation();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const styles = StyleSheet.create({
    copyToClipboard: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    copyToClipboardText: {
      fontSize: 13,
      fontWeight: '400',
      color: '#68bbe1',
    },
    center: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 54,
    },
    logo: {
      width: 150,
      height: 150,
    },
    textFree: {
      maxWidth: 260,
      marginVertical: 24,
      color: '#9AA0AA',
      fontSize: 15,
      textAlign: 'center',
      fontWeight: '500',
    },
    textBackup: {
      maxWidth: 260,
      marginBottom: 40,
      color: colors.foregroundColor,
      fontSize: 15,
      textAlign: 'center',
      fontWeight: '500',
    },
    buildWith: {
      backgroundColor: colors.inputBackgroundColor,
      padding: 16,
      paddingTop: 0,
      borderRadius: 8,
    },
    buttonLink: {
      backgroundColor: colors.lightButton,
      borderRadius: 12,
      justifyContent: 'center',
      padding: 8,
      flexDirection: 'row',
    },
    textLink: {
      color: colors.foregroundColor,
      marginLeft: 8,
      fontWeight: '600',
    },
  });

  const handleOnReleaseNotesPress = () => {
    navigate('ReleaseNotes');
  };

  const handleOnLicensingPress = () => {
    navigate('Licensing');
  };

  const handleOnTwitterPress = () => {
    Linking.openURL('https://twitter.com/phuquoc_dog');
  };

  const handleOnAirdropPress = () => {
    Linking.openURL('https://phuquoc.dog/participate-in-the-one-billion-pqd-airdrop/')
  }
  const handleOnDiscordPress = () => {
    Linking.openURL('https://discord.com/invite/HJEadfBYf8');
  };

  const handleOnTelegramPress = () => {
    Linking.openURL('https://t.me/phuquocdog');
  };
  const handleOnGithubPress = () => {
    Linking.openURL('https://github.com/phuquocdog');
  };
  const handleOnRatePress = () => {
    const options = {
      AppleAppID: '1376878040',
      GooglePackageName: 'dog.phuquoc.wallet',
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: true,
      openAppStoreIfInAppFails: true,
      fallbackPlatformURL: 'https://phuquoc.dog',
    };
    Rate.rate(options, success => {
      if (success) {
        console.log('User Rated.');
      }
    });
  };

  return (
    <ScrollView testID="AboutScrollView" contentInsetAdjustmentBehavior="automatic">
      <BlueCard>
        <View style={styles.center}>
          <Image style={styles.logo} source={require('../../img/black120x120.png')} />
          <Text style={styles.textFree}>
          The current feature is not complete. We will update the next version!
          </Text>
          <BlueButton onPress={handleOnRatePress} title={loc.settings.about_review + ' ⭐🙏'} />
        </View>
      </BlueCard>
      <BlueListItem
        leftIcon={{
          name: 'twitter',
          type: 'font-awesome',
          color: '#1da1f2',
        }}
        onPress={handleOnAirdropPress}
        title="Airdrop coin"
      />
      <BlueListItem
        leftIcon={{
          name: 'twitter',
          type: 'font-awesome',
          color: '#1da1f2',
        }}
        onPress={handleOnTwitterPress}
        title={loc.settings.about_sm_twitter}
      />
      <BlueListItem
        leftIcon={{
          name: 'telegram',
          type: 'font-awesome',
          color: '#0088cc',
        }}
        onPress={handleOnTelegramPress}
        title={loc.settings.about_sm_telegram}
      />
      <BlueListItem
        leftIcon={{
          name: 'discord',
          type: 'font-awesome-5',
          color: '#7289da',
        }}
        onPress={handleOnDiscordPress}
        title={loc.settings.about_sm_discord}
      />
      
      <BlueSpacing20 />
      
      
      <BlueSpacing20 />
      <BlueSpacing20 />
    </ScrollView>
  );
};

export default Soon;
