const Web3 = require('web3');

const unlockWeb3 = (provider, privateKey) => {
  const web3 = new Web3(provider);
  const account = web3.eth.accounts.wallet.add(privateKey);
  web3.eth.defaultAccount = account.address;

  return web3;
};

module.exports = unlockWeb3;
