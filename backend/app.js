const unlockWeb3 = require('./unlockedWeb3');
const TestContract = require('./TestContract');
const Oracle = require('./Oracle');
const fs = require('fs');

const provider = 'wss://ropsten.infura.io/ws';
const privateKey = process.argv[2];
// const privateKey = '0x387fd56b827b0766a55054eee6f642532152245dae327af39710d011dfe498c1';

const contractAddress = '0x0d4536b6fe98a1fdcc660caf7478fc2b8d9e4195';
const { abi } = JSON.parse(fs.readFileSync(`${__dirname}/../build/contracts/TestContract.json`, 'utf8'));

const web3 = unlockWeb3(provider, privateKey);
const testContract = new TestContract(web3, abi, contractAddress);

const oracle = new Oracle(web3, testContract);
oracle.run();

