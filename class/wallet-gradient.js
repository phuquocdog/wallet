
import { useTheme } from '@react-navigation/native';

export default class WalletGradient {
  static hdSegwitP2SHWallet = ['#007AFF', '#0040FF'];
  static hdSegwitBech32Wallet = ['#6CD9FC', '#44BEE5'];
  static segwitBech32Wallet = ['#6CD9FC', '#44BEE5'];
  static watchOnlyWallet = ['#474646', '#282828'];
  static legacyWallet = ['#37E8C0', '#15BE98'];
  static hdLegacyP2PKHWallet = ['#FD7478', '#E73B40'];
  static hdLegacyBreadWallet = ['#fe6381', '#f99c42'];
  static multisigHdWallet = ['#1ce6eb', '#296fc5', '#3500A2'];
  static defaultGradients = ['#B770F6', '#9013FE'];
  static lightningCustodianWallet = ['#F1AA07', '#FD7E37'];
  static aezeedWallet = ['#8584FF', '#5351FB'];
  static PQDWallet = ['#2871cc', '#2871cc'];

  static createWallet = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { colors } = useTheme();
    return colors.lightButton;
  };

  static gradientsFor(type) {
    let gradient;
    gradient = WalletGradient.PQDWallet;
    return gradient;
  }

  static linearGradientProps(type) {
    let props;
    
    return props;
  }

  static headerColorFor(type) {
    let gradient;
    gradient = WalletGradient.PQDWallet;
    return gradient[0];
  }
}
