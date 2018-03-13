const unlockWeb3 = require('./unlockedWeb3');
const UsingOracleContract = require('./UsingOracleContract');
const Oracle = require('./Oracle');
const fs = require('fs');

const provider = 'wss://ropsten.infura.io/ws';
const privateKey = process.argv[2];
// const privateKey = '0x387fd56b827b0766a55054eee6f642532152245dae327af39710d011dfe498c1';

const contractAddress = '0x36974fb58543f51442d17334d7e2542b92c73fd1';
const { abi } = JSON.parse(fs.readFileSync(`${__dirname}/../build/contracts/UsingMultipleOracle.json`, 'utf8'));

const web3 = unlockWeb3(provider, privateKey);
const usingOracleContract = new UsingOracleContract(web3, abi, contractAddress);

const oracle = new Oracle(web3, usingOracleContract);
oracle.run();

