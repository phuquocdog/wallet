
const Alice = '5DFignjD1nYb11saiStmZnJTno9yTW1RGfmXLhbyaQCEoSFq';
import { ApiPromise, WsProvider } from '@polkadot/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


export class PhuquocdogWallet {

  constructor(props) {
    this.props = props;
    this.balanceHuman = '0 PQD';
    this.userHasSavedExport = false;
  }

  async connect (account) {
      const provider = new WsProvider(process.env.WS || 'wss://node.phuquoc.dog');
      const api = await ApiPromise.create({provider});
      const { nonce, data: balance } = await api.query.system.account(account);
      return balance;
  }


  getBalance() {
    return 10;

  }

  setBalanceHuman(b){
    if (b != 0) {
      return this.balanceHuman = b;
    }
  }

  async getBalanceHuman() {

    try {
      const result = await this.connect(this.props.address);

      if (result) {
        this.setBalanceHuman(result.free.toHuman());

      }
    } catch (_) {}
  
    return this.balanceHuman;
  }
  latestTransactionText() {
    return 'Never';
  }
  getSecret() {
    return this.props.secret
  }
  
  getIsFailure() {
    return 1;
  }
  getLabel() {
    // no longer used in wallets carousel
    return this.props.label? this.props.label : 'Your PQD';
  }
  getHideTransactionsInWalletsList() {
    return '123';
  }
  getPreferredBalanceUnit() {
    return 'getPreferredBalanceUnit';
  }
  getID() {
    return this.props.address;
  }
  getLatestTransactionTime() {
    return 'getLatestTransactionTime'
  }
  getTransactions() {
    return []
  }
  timeToRefreshBalance() {
    return 'timeToRefreshBalance';
  }
  allowSend(){
    return true;
  }
  allowReceive() {
    return 'allowReceive';
  }
  fetchBalance() {
    return 1;
  }
  getPreferredBalanceUnit() {
    return 'getPreferredBalanceUnit()'
  }
  fetchTransactions() {
    return 'fetchTransactions'
  }
  getLastTxFetch(){
    return 'getLastTxFetch';
  }
  useWithHardwareWalletEnabled () {
    return 'wallet.useWithHardwareWalletEnabled'
  }
  allowXpub () {
    return 'wallet.allowXpub'
  }
  allowSignVerifyMessage() {
    return 'allowSignVerifyMessage()'
  }
  getAddress() {
    return this.props.address;
  }
  setUserHasSavedExport(v){
    this.setUserHasSavedExport = v
  }
  getType() {
    return this.props.type;
  }
  allowCosignPsbt() {
    return false;
  }
  /**
   * Fetches UTXO from API. Returns VOID.
   *
   * @return {Promise.<void>}
   */
  async fetchUtxo() {
    try {
      return 
      
    } catch (Error) {
      console.warn(Error);
    }
  }
  getUserHasSavedExport() {
    return true;
  }
}
