/* global alert */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PhuquocdogWallet} from './wallets/phuquocdog-wallet';

let usedBucketNum = false;
let savingInProgress = 0; // its both a flag and a counter of attempts to write to disk

export class AppStorage {
  static FLAG_ENCRYPTED = 'data_encrypted';
  static LNDHUB = 'lndhub';
  static ADVANCED_MODE_ENABLED = 'advancedmodeenabled';
  static DO_NOT_TRACK = 'donottrack';
  static HODL_HODL_API_KEY = 'HODL_HODL_API_KEY';
  static HODL_HODL_SIGNATURE_KEY = 'HODL_HODL_SIGNATURE_KEY';
  static HODL_HODL_CONTRACTS = 'HODL_HODL_CONTRACTS';
  static HANDOFF_STORAGE_KEY = 'HandOff';

  static keys2migrate = [AppStorage.HANDOFF_STORAGE_KEY, AppStorage.DO_NOT_TRACK, AppStorage.ADVANCED_MODE_ENABLED];

  constructor() {
    /** {Array.<AbstractWallet>} */
    this.wallets = [];
    this.tx_metadata = {};
    this.cachedPassword = false;
  }

  async migrateKeys() {
    
  }

  /**
   * Wrapper for storage call. Secure store works only in RN environment. AsyncStorage is
   * used for cli/tests
   *
   * @param key
   * @param value
   * @returns {Promise<any>|Promise<any> | Promise<void> | * | Promise | void}
   */
  setItem = (key, value) => {
    return AsyncStorage.setItem(key, value);
  };

  /**
   * Wrapper for storage call. Secure store works only in RN environment. AsyncStorage is
   * used for cli/tests
   *
   * @param key
   * @returns {Promise<any>|*}
   */
  getItem = key => {
    return AsyncStorage.getItem(key);
  };

  

  storageIsEncrypted = async () => {
    return '';
  };

  isPasswordInUse = async password => {
    try {
      let data = await this.getItem('data');
      data = this.decryptData(data, password);
      return !!data;
    } catch (_e) {
      return false;
    }
  };

  /**
   * Iterates through all values of `data` trying to
   * decrypt each one, and returns first one successfully decrypted
   *
   * @param data {string} Serialized array
   * @param password
   * @returns {boolean|string} Either STRING of storage data (which is stringified JSON) or FALSE, which means failure
   */
  decryptData(data, password) {
    data = JSON.parse(data);
    
    return false;
  }

  decryptStorage = async password => {
    if (password === this.cachedPassword) {
      this.cachedPassword = undefined;
      await this.saveToDisk();
      this.wallets = [];
      this.tx_metadata = [];
      return this.loadFromDisk();
    } else {
      throw new Error('Incorrect password. Please, try again.');
    }
  };

  encryptStorage = async password => {
    // assuming the storage is not yet encrypted
    await this.saveToDisk();
    let data = await this.getItem('data');
    
  };

  /**
   * Cleans up all current application data (wallets, tx metadata etc)
   * Encrypts the bucket and saves it storage
   *
   * @returns {Promise.<boolean>} Success or failure
   */
  createFakeStorage = async fakePassword => {
    usedBucketNum = false; // resetting currently used bucket so we wont overwrite it
    this.wallets = [];
    this.tx_metadata = {};

    const data = {
      wallets: [],
      tx_metadata: {},
    };

    let buckets = await this.getItem('data');
    buckets = JSON.parse(buckets);
    buckets.push(encryption.encrypt(JSON.stringify(data), fakePassword));
    this.cachedPassword = fakePassword;
    const bucketsString = JSON.stringify(buckets);
    await this.setItem('data', bucketsString);
    return (await this.getItem('data')) === bucketsString;
  };

  hashIt = s => {
    return createHash('sha256').update(s).digest().toString('hex');
  };

  
  

  resetData() {
    AsyncStorage.setItem('data', '');
    AsyncStorage.clear();
  }
  /**
   * Loads from storage all wallets and
   * maps them to `this.wallets`
   *
   * @param password If present means storage must be decrypted before usage
   * @returns {Promise.<boolean>}
   */
  async loadFromDisk(password) {
    //this.resetData();
    let data = await this.getItem('data');
  
    if (data !== null) {
      data = JSON.parse(data);
      if (!data.wallets) return false;
      for (const key of data.wallets) {
        w = new PhuquocdogWallet(key.props);
        this.wallets.push(w)
      }
      return true;
    } else {
      return false; // failed loading data or loading/decryptin data
    }
  }

  /**
   * Lookup wallet in list by it's secret and
   * remove it from `this.wallets`
   *
   * @param wallet {AbstractWallet}
   */
  deleteWallet = wallet => {
    const secret = wallet.getSecret();
    const tempWallets = [];

    for (const value of this.wallets) {
      tempWallets.push(value);
    }
    this.wallets = tempWallets;
  };

  /**
   * Serializes and saves to storage object data.
   * If cached password is saved - finds the correct bucket
   * to save to, encrypts and then saves.
   *
   * @returns {Promise} Result of storage save
   */
  async saveToDisk() {
   
    try {
      const walletsToSave = [];
      for (const key of this.wallets) {
        w = new PhuquocdogWallet(key.props);
        walletsToSave.push(w)
      }
       
      let data = {
        wallets: walletsToSave,
        txMetadata: this.tx_metadata,
      };
      //console.log(JSON.stringify(data));
     
      await this.setItem('data', JSON.stringify(data));
      //await this.setItem(AppStorage.FLAG_ENCRYPTED, '');

    } catch (error) {

      console.error('save to disk exception:', error.message);
      alert('save to disk exception: ' + error.message);
    } finally {
      savingInProgress = 0;
    }
  }

  /**
   * For each wallet, fetches balance from remote endpoint.
   * Use getter for a specific wallet to get actual balance.
   * Returns void.
   * If index is present then fetch only from this specific wallet
   *
   * @return {Promise.<void>}
   */
  fetchWalletBalances = async index => {
    console.log('fetchWalletBalances for wallet#', typeof index === 'undefined' ? '(all)' : index);
    await wallet.fetchBalance();
  };

  /**
   * Fetches from remote endpoint all transactions for each wallet.
   * Returns void.
   * To access transactions - get them from each respective wallet.
   * If index is present then fetch only from this specific wallet.
   *
   * @param index {Integer} Index of the wallet in this.wallets array,
   *                        blank to fetch from all wallets
   * @return {Promise.<void>}
   */
  fetchWalletTransactions = async index => {
    console.log('fetchWalletTransactions for wallet#', typeof index === 'undefined' ? '(all)' : index);
    await wallet.fetchTransactions();
    if (wallet.fetchPendingTransactions) {
      await wallet.fetchPendingTransactions();
    }
    if (wallet.fetchUserInvoices) {
      await wallet.fetchUserInvoices();
    }
  };

  /**
   *
   * @returns {Array.<AbstractWallet>}
   */
  getWallets = () => {
    return this.wallets;
  };

  /**
   * Getter for all transactions in all wallets.
   * But if index is provided - only for wallet with corresponding index
   *
   * @param index {Integer|null} Wallet index in this.wallets. Empty (or null) for all wallets.
   * @param limit {Integer} How many txs return, starting from the earliest. Default: all of them.
   * @param includeWalletsWithHideTransactionsEnabled {Boolean} Wallets' _hideTransactionsInWalletsList property determines wether the user wants this wallet's txs hidden from the main list view.
   * @return {Array}
   */
  getTransactions = (index, limit = Infinity, includeWalletsWithHideTransactionsEnabled = false) => {
    if (index || index === 0) {
      let txs = [];
      let c = 0;
      for (const wallet of this.wallets) {
        if (c++ === index) {
          txs = txs.concat(wallet.getTransactions());
        }
      }
      return txs;
    }

    let txs = [];
    for (const wallet of this.wallets.filter(w => includeWalletsWithHideTransactionsEnabled || !w.getHideTransactionsInWalletsList())) {
      const walletTransactions = wallet.getTransactions();
      for (const t of walletTransactions) {
        t.walletPreferredBalanceUnit = wallet.getPreferredBalanceUnit();
      }
      txs = txs.concat(walletTransactions);
    }

    for (const t of txs) {
      t.sort_ts = +new Date(t.received);
    }

    return txs
      .sort(function (a, b) {
        return b.sort_ts - a.sort_ts;
      })
      .slice(0, limit);
  };

  /**
   * Getter for a sum of all balances of all wallets
   *
   * @return {number}
   */
  getBalance = () => {
    let finalBalance = 0;
    for (const wal of this.wallets) {
      finalBalance += wal.getBalance();
    }
    return finalBalance;
  };

  getHodlHodlApiKey = async () => {
    try {
      return await this.getItem(AppStorage.HODL_HODL_API_KEY);
    } catch (_) {}
    return false;
  };

  getHodlHodlSignatureKey = async () => {
    try {
      return await this.getItem(AppStorage.HODL_HODL_SIGNATURE_KEY);
    } catch (_) {}
    return false;
  };

  /**
   * Since we cant fetch list of contracts from hodlhodl api yet, we have to keep track of it ourselves
   *
   * @returns {Promise<string[]>} String ids of contracts in an array
   */
  getHodlHodlContracts = async () => {
    try {
      const json = await this.getItem(AppStorage.HODL_HODL_CONTRACTS);
      return JSON.parse(json);
    } catch (_) {}
    return [];
  };

  addHodlHodlContract = async id => {
    let json;
    try {
      json = await this.getItem(AppStorage.HODL_HODL_CONTRACTS);
      json = JSON.parse(json);
    } catch (_) {
      json = [];
    }

    json.push(id);
    return this.setItem(AppStorage.HODL_HODL_CONTRACTS, JSON.stringify(json));
  };

  setHodlHodlApiKey = async (key, sigKey) => {
    if (sigKey) await this.setItem(AppStorage.HODL_HODL_SIGNATURE_KEY, sigKey);
    return this.setItem(AppStorage.HODL_HODL_API_KEY, key);
  };

  isAdancedModeEnabled = async () => {
    try {
      return !!(await AsyncStorage.getItem(AppStorage.ADVANCED_MODE_ENABLED));
    } catch (_) {}
    return false;
  };

  setIsAdancedModeEnabled = async value => {
    await AsyncStorage.setItem(AppStorage.ADVANCED_MODE_ENABLED, value ? '1' : '');
  };

  isHandoffEnabled = async () => {
    try {
      return !!(await AsyncStorage.getItem(AppStorage.HANDOFF_STORAGE_KEY));
    } catch (_) {}
    return false;
  };

  setIsHandoffEnabled = async value => {
    await AsyncStorage.setItem(AppStorage.HANDOFF_STORAGE_KEY, value ? '1' : '');
  };

  isDoNotTrackEnabled = async () => {
    try {
      return !!(await AsyncStorage.getItem(AppStorage.DO_NOT_TRACK));
    } catch (_) {}
    return false;
  };

  setDoNotTrack = async value => {
    await AsyncStorage.setItem(AppStorage.DO_NOT_TRACK, value ? '1' : '');
  };

  /**
   * Simple async sleeper function
   *
   * @param ms {number} Milliseconds to sleep
   * @returns {Promise<Promise<*> | Promise<*>>}
   */
  sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  startAndDecrypt = async retry => {
    console.log('startAndDecrypt');

    if (this.getWallets().length > 0) {
      console.log('App already has some wallets');
      return true;
    }
    let password = false;
    await this.loadFromDisk(password);
    return true;
  };

  async test() {
    console.log('test-app-store');
  }
}
