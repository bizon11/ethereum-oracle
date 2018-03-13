/* global artifacts */

const TestContract = artifacts.require('./TestContract.sol');

module.exports = (deployer) => {
  deployer.deploy(TestContract, '0xB660b10a922815667F0303576750FDBC6943e44a');
};
