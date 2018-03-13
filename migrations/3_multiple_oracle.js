/* global artifacts */

const UsingMultipleOracle = artifacts.require('./UsingMultipleOracle.sol');

module.exports = (deployer) => {
  deployer.deploy(
    UsingMultipleOracle,
    2,
    ['0xB660b10a922815667F0303576750FDBC6943e44a', '0x982A6D0985293D782B1020B835F4516a6b69AC3c'],
  );
};
