import { LegacyWallet } from './wallets/legacy-wallet';
import { HDSegwitP2SHWallet } from './wallets/hd-segwit-p2sh-wallet';
import { LightningCustodianWallet } from './wallets/lightning-custodian-wallet';
import { HDLegacyBreadwalletWallet } from './wallets/hd-legacy-breadwallet-wallet';
import { HDLegacyP2PKHWallet } from './wallets/hd-legacy-p2pkh-wallet';
import { WatchOnlyWallet } from './wallets/watch-only-wallet';
import { HDSegwitBech32Wallet } from './wallets/hd-segwit-bech32-wallet';
import { PlaceholderWallet } from './wallets/placeholder-wallet';
import { SegwitBech32Wallet } from './wallets/segwit-bech32-wallet';
import { HDLegacyElectrumSeedP2PKHWallet } from './wallets/hd-legacy-electrum-seed-p2pkh-wallet';
import { HDSegwitElectrumSeedP2WPKHWallet } from './wallets/hd-segwit-electrum-seed-p2wpkh-wallet';
import { MultisigHDWallet } from './wallets/multisig-hd-wallet';
import { HDAezeedWallet } from './wallets/hd-aezeed-wallet';
import { SLIP39LegacyP2PKHWallet, SLIP39SegwitP2SHWallet, SLIP39SegwitBech32Wallet } from './wallets/slip39-wallets';
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
  static PQDWallet = ['#2f905e', '#6aac54'];

  static createWallet = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { colors } = useTheme();
    return colors.lightButton;
  };

  static gradientsFor(type) {
    let gradient;
    console.log('type----->' + type);

    switch (type) {
      case WatchOnlyWallet.type:
        gradient = WalletGradient.watchOnlyWallet;
        break;
      default:
        gradient = WalletGradient.PQDWallet;
        break;
    }
    return gradient;
  }

  static linearGradientProps(type) {
    let props;
    switch (type) {
      case MultisigHDWallet.type:
        /* Example
        props = { start: { x: 0, y: 0 } };
        https://github.com/react-native-linear-gradient/react-native-linear-gradient
        */
        break;
      default:
        break;
    }
    return props;
  }

  static headerColorFor(type) {
    let gradient;
    switch (type) {
      case HDAezeedWallet.type:
        gradient = WalletGradient.aezeedWallet;
        break;
      default:
        gradient = WalletGradient.PQDWallet;
        break;
    }
    return gradient[0];
  }
}
