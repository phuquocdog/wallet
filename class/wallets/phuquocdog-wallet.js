

export class PhuquocdogWallet {

  constructor(props) {
    this.props = props;    
  }

  getBalance() {
    return '1000';
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
    return 'getTransactions'
  }
  timeToRefreshBalance() {
    return 'timeToRefreshBalance';
  }
  allowSend(){
    return 'allowSend'
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
}
