import React from 'react';
import { View, ScrollView } from 'react-native';
import connect from 'redux-connect-decorator';
import { translate } from 'react-i18next';

import { transactionAdded as transactionAddedAction } from '../../../../../actions/transactions';
import FormattedNumber from '../../../../shared/formattedNumber';
import { toRawLsk, fromRawLsk } from '../../../../../utilities/conversions';
import { PrimaryButton } from '../../../../shared/toolBox/button';
import Avatar from '../../../../shared/avatar';
import Icon from '../../../../shared/toolBox/icon';
import {
  H4, B, P
} from '../../../../shared/toolBox/typography';
import withTheme from '../../../../shared/withTheme';
import getStyles from './styles';
import { colors } from '../../../../../constants/styleGuide';
import { tokenMap } from '../../../../../constants/tokens';
import DropDownHolder from '../../../../../utilities/alert';
import HeaderBackButton from '../../../router/headerBackButton';
import ReadMore from './readMore';

const getTranslatedMessages = t => ({
  initialize: {
    title: t('Initialize your account'),
    subtitle: t(
      'By initializing your account, you are taking an additional step towards securing your account.'
    ),
    button: t('Initialize now'),
    reference: t('Account initialization'),
  },
  send: {
    title: t('Ready to send'),
    button: t('Send now'),
    buttonBusy: t('Sending'),
  },
});

@connect(
  state => ({
    language: state.settings.language,
  }),
  {
    transactionAdded: transactionAddedAction,
  }
)
class Overview extends React.Component {
  state = {
    initialize: false,
    busy: false,
  };

  componentDidMount() {
    const {
      t, prevStep, navigation, route
    } = this.props;
    const { send, initialize } = getTranslatedMessages(t);
    let options = {
      title: send.title,
      headerLeft: props => <HeaderBackButton {...props} onPress={prevStep} safeArea={true} />,
    };

    if (route.params?.initialize) {
      this.setState({
        initialize: true,
      });

      options = {
        title: initialize.title,
        headerLeft: () => null,
      };
    }

    navigation.setOptions(options);
    navigation.setParams({ initialize: false });
  }

  componentDidUpdate(prevProps) {
    const {
      t, lng, navigation, route
    } = this.props;

    if (prevProps.lng !== lng) {
      const { initialize, send } = getTranslatedMessages(t);

      navigation.setOptions({
        title: route.params?.initialize ? initialize : send,
      });
    }
  }

  componentWillUnmount() {
    const {
      t,
      navigation: { setParams },
    } = this.props;
    setParams({ title: t('Send') });
  }

  send = () => {
    const {
      nextStep,
      transactionAdded,
      t,
      accounts: { passphrase },
      sharedData: {
        amount,
        address,
        reference,
        secondPassphrase,
        fee,
        dynamicFeePerByte,
      },
    } = this.props;

    DropDownHolder.closeAlert();

    this.setState({ busy: true }, () => {
      transactionAdded(
        {
          recipientAddress: address,
          amount: toRawLsk(amount),
          fee,
          passphrase,
          secondPassphrase,
          reference,
          dynamicFeePerByte,
        },
        nextStep,
        (error = {}) => {
          this.setState({ busy: false });
          DropDownHolder.error(
            t('Error'),
            error.message || t('An error happened. Please try later.')
          );
        }
      );
    });
  };

  // eslint-disable-next-line complexity
  render() {
    const {
      t,
      styles,
      theme,
      route,
      settings,
      accounts: { followed },
      sharedData: {
        address, amount, reference, fee
      },
      settings: { token },
      language,
    } = this.props;

    const actionType = route.params?.initialize || this.state.initialize
      ? 'initialize'
      : 'send';

    const translatedMessages = getTranslatedMessages(t);
    const bookmark = followed[token.active].find(
      item => item.address === address
    );

    return (
      <ScrollView
        style={[styles.container, styles.theme.container]}
        contentContainerStyle={styles.innerContainer}
      >
        <View>
          <ReadMore
            actionType={actionType}
            styles={styles}
            messages={translatedMessages}
            t={t}
          />

          <View style={[styles.row, styles.theme.row, styles.addressContainer]}>
            {settings.token.active === tokenMap.LSK.key ? (
              <Avatar address={address || ''} style={styles.avatar} size={50} />
            ) : (
              <View
                style={[
                  styles.addressIconContainer,
                  styles.theme.addressIconContainer,
                ]}
              >
                <Icon
                  name="btc"
                  style={styles.addressIcon}
                  color={colors[theme].white}
                  size={20}
                />
              </View>
            )}

            {bookmark ? (
              <H4 style={styles.theme.text}>{bookmark.label}</H4>
            ) : null}

            <P style={[styles.text, styles.theme.address, styles.address]}>
              {address}
            </P>
          </View>

          <View style={[styles.row, styles.theme.row]}>
            <Icon
              name={actionType === 'initialize' ? 'tx-fee' : 'amount'}
              style={styles.icon}
              size={20}
              color={colors.light.blueGray}
            />

            <View style={styles.rowContent}>
              <P style={[styles.label, styles.theme.label]}>
                {actionType === 'initialize'
                  ? t('Transaction fee')
                  : t('Amount')}
              </P>
              <B style={[styles.text, styles.theme.text]}>
                <FormattedNumber
                  tokenType={settings.token.active}
                  language={language}
                >
                  {amount}
                </FormattedNumber>
              </B>
            </View>
          </View>

          {actionType !== 'initialize' ? (
            <View style={[styles.row, styles.theme.row]}>
              <Icon
                name="tx-fee"
                style={styles.icon}
                size={20}
                color={colors.light.blueGray}
              />

              <View style={styles.rowContent}>
                <P style={[styles.label, styles.theme.label]}>
                  {t('Transaction fee')}
                </P>
                <B style={[styles.text, styles.theme.text]}>
                  <FormattedNumber
                    tokenType={settings.token.active}
                    language={language}
                  >
                    {fromRawLsk(fee)}
                  </FormattedNumber>
                </B>
              </View>
            </View>
          ) : null}

          {reference ? (
            <View style={[styles.row, styles.theme.row]}>
              <Icon
                name="reference"
                style={styles.icon}
                size={20}
                color={colors.light.blueGray}
              />

              <View style={styles.rowContent}>
                <P style={[styles.label, styles.theme.label]}>{t('Message')}</P>
                <B style={[styles.text, styles.theme.text]}>{reference}</B>
              </View>
            </View>
          ) : null}
        </View>

        <View>
          <PrimaryButton
            disabled={this.state.busy}
            style={styles.button}
            onClick={this.send}
            title={
              this.state.busy
                ? translatedMessages[actionType].buttonBusy
                : translatedMessages[actionType].button
            }
          />
        </View>
      </ScrollView>
    );
  }
}

export default withTheme(translate()(Overview), getStyles());
