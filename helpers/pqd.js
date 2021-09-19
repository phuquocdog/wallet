
const formatBalance = (balance) => {
  return balance + 'PQD';
}
const formatAmountFiat = (balance) => {
  return balance*0.0001;
}

export {
  formatBalance,
  formatAmountFiat
}