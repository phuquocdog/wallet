import { Keyring } from '@polkadot/keyring';
import { ApiPromise, WsProvider } from '@polkadot/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BN = require('bn.js');

export class PhuquocdogWallet {

  constructor(props) {
    this.props = props;
    this.balanceHuman = '0 PQD';
    this.userHasSavedExport = false;
  }

  async connect () {
    const provider = new WsProvider(process.env.WS || 'wss://node.phuquoc.dog');
    return await ApiPromise.create({provider});
      
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
      let b = await AsyncStorage.getItem(this.getAddress());
      if (b !== null) {
        b = JSON.parse(b)
        console.log('get data cache',b);
        this.setBalanceHuman(b.balanceHuman);
      } else {
        console.log('set data cache');
        const c = await this.connect();
        const { nonce, data: balance } = await c.query.system.account(this.props.address);
        if (balance) {
          this.setBalanceHuman(balance.free.toHuman());
  
          //Cache data to Store
          await AsyncStorage.setItem(this.getAddress(), JSON.stringify({
            'balanceHuman': balance.free.toHuman()
          }));

        }
      }
    } catch (e) {
      console.log('error', e)
    }
  
    return this.balanceHuman;
  }
  async saveTransaction(id) {

    try {
      let b = await AsyncStorage.getItem(this.getAddress());
      let transactions = [];
      if (b !== null) {
        data = JSON.parse(b);
        transactions.push(id);
        data.transactions = transactions;

        console.log('----->', data);
        console.log('>>>>>>'. transactions);

        //Cache data to Store
        await AsyncStorage.setItem(this.getAddress(), JSON.stringify(data));
      }
    } catch (e) {
      console.log('saveTransaction error', e)
    }

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
  async getTransactions(limit) {
    try {
      let result = await AsyncStorage.getItem(this.getAddress());
      if (result !== null) {
        data = JSON.parse(result);
        return data.transactions
      }
    } catch (e) {
      console.log('saveTransaction error', e)
      return [];
    }
    
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

  async transfer(amount, address) {
    try {
      const api = await this.connect();

      // Constuct the keyring after the API (crypto has an async init)
      const keyring = new Keyring({ type: 'sr25519' });
      // Add myAccount to our keyring with a hard-deived path (empty phrase, so uses dev)
      const myAccount = keyring.addFromUri(this.getSecret());

      const decims = new BN(api.registry.chainDecimals);
      const factor = new BN(10).pow(decims);
      const amountUnit = new BN(amount).mul(factor);

      const transfer = api.tx.balances.transfer(address, amountUnit);
      // Sign and send the transaction using our account
      const hash = await transfer.signAndSend(myAccount);

      console.log('Transfer sent with hash', hash.toHex())

      return hash;

    } catch (e) {
      console.log('Transfer Error',e.message)

    }
    return false;
  
  }
}
