const HDWalletProvider = require('truffle-hdwallet-provider');

const infuraApiKey = 'AUboXdechZpJLLyHptVO';
const mnemonic = 'grief violin lava audit balance casual veteran student suspect blur laugh clutch';

const provider = new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${infuraApiKey}`);

module.exports = {
  networks: {
    ropsten: {
      provider,
      network_id: 3,
      gas: 4612388,
    },
  },
};
