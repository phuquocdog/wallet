import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { View, StyleSheet, SafeAreaView,Linking,Button } from 'react-native';
import { Text } from 'react-native-elements';
import BigNumber from 'bignumber.js';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';

import { BlueButton, BlueButtonLink, BlueCard, BlueLoading, BlueSpacing20, BlueText, SafeBlueArea } from '../../BlueComponents';

import loc from '../../loc';

const SendSuccess = ({navigation}) => {
  const pop = () => {
    dangerouslyGetParent().pop();
  };
  const { colors } = useTheme();
  const { dangerouslyGetParent } = useNavigation();
  const { amount, fee, txtUrl = '', invoiceDescription = '', onDonePressed = pop } = useRoute().params;
  const stylesHook = StyleSheet.create({
    root: {
      backgroundColor: colors.elevated,
    },
    amountValue: {
      color: colors.alternativeTextColor2,
    },
    amountUnit: {
      color: colors.alternativeTextColor2,
    },
  });
  useEffect(() => {
    console.log('send/success - useEffect');
    ReactNativeHapticFeedback.trigger('notificationSuccess', { ignoreAndroidSystemSettings: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goHome = () => {
    navigation.popToTop()
  }

  return (
    <SafeAreaView style={[styles.root, stylesHook.root]}>
      <SuccessView
        amount={amount}
        txtUrl={txtUrl}
        fee={fee}
        invoiceDescription={invoiceDescription}
        onDonePressed={onDonePressed}
      />
      
      <View style={styles.buttonContainer}>
        <BlueButton onPress={goHome} title={loc.send.success_done} />
      </View>
    </SafeAreaView>
  );
};

export default SendSuccess;

export const SuccessView = ({ amount, txtUrl, fee, invoiceDescription, shouldAnimate = true }) => {
  const animationRef = useRef();
  const { colors } = useTheme();

  const stylesHook = StyleSheet.create({
    amountValue: {
      color: colors.alternativeTextColor2,
    },
    amountUnit: {
      color: colors.alternativeTextColor2,
    },
  });

  useEffect(() => {
    if (shouldAnimate) {
      animationRef.current.reset();
      animationRef.current.resume();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors]);

  const goTxt = () => {
    Linking.openURL(txtUrl);
  }

  return (
    <View style={styles.root}>
      <BlueCard style={styles.amount}>
        <View style={styles.view}>
          {amount && (
            <>
              <Text style={[styles.amountValue, stylesHook.amountValue]}>{amount} PQD</Text>
            </>
          )}
        </View>
        {fee > 0 && (
          <Text style={styles.feeText}>
            {loc.send.create_fee}: {fee} PQD
          </Text>
        )}

       
        <Text numberOfLines={0} style={styles.feeText}>
          {invoiceDescription}
        </Text>
      </BlueCard>
      <View style={styles.ready}>

        <Button
          styles={styles.buttonTxt}
          onPress={goTxt}
          title="See transaction"
        />

        <LottieView
          style={styles.lottie}
          source={require('../../img/bluenice.json')}
          autoPlay={shouldAnimate}
          ref={animationRef}
          loop={false}
          progress={shouldAnimate ? 0 : 1}
          colorFilters={[
            {
              keypath: 'spark',
              color: colors.success,
            },
            {
              keypath: 'circle',
              color: colors.success,
            },
            {
              keypath: 'Oval',
              color: colors.successCheck,
            },
          ]}
        />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 19,
  },
  buttonContainer: {
    padding: 58,
  },
  amount: {
    alignItems: 'center',
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 76,
    paddingBottom: 16,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: '600',
  },
  amountUnit: {
    fontSize: 16,
    marginHorizontal: 4,
    paddingBottom: 6,
    fontWeight: '600',
    alignSelf: 'flex-end',
  },
  feeText: {
    color: '#37c0a1',
    fontSize: 14,
    marginHorizontal: 4,
    paddingBottom: 6,
    fontWeight: '500',
    alignSelf: 'center',
  },
  ready: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 43,
    marginBottom: 53,
  },
  lottie: {
    width: 400,
    height: 250,
  },
  buttonTxt: {
    width: 700,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    
  }
});
