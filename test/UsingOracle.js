/* global artifacts, contract, it, beforeEach */
/* eslint no-underscore-dangle: 0 */

const { inTransaction } = require('./utils/expectEvent');
require('chai')
  .use(require('chai-as-promised'))
  .should();

const EVMThrow = message => `VM Exception while processing transaction: ${message}`;
const EVMRevert = EVMThrow('revert');

const UsingOracle = artifacts.require('UsingOracle');

contract('UsingOracle', (accounts) => {
  const oracleAddress = accounts[1];
  const otherAdddress = accounts[2];

  beforeEach(async () => {
    this.usingOracle = await UsingOracle.new(oracleAddress);
  });

  it('should emit a Query event', async () => {
    // when
    const transaction = this.usingOracle.query('json(http://api.fixer.io/latest?symbols=USD,GBP).rates.GBP');

    // then
    await inTransaction(transaction, 'Query');
  });

  it('should emit a Result event when gets callback', async () => {
    // given
    await this.usingOracle.query('json(http://api.fixer.io/latest?symbols=USD,GBP).rates.GBP');

    // when
    const transaction = this.usingOracle.__callback('1.23', { from: oracleAddress });

    // then
    await inTransaction(transaction, 'Result');
  });

  it('should reject callback from addresses other than oracle', async () => {
    // given
    await this.usingOracle.query('json(http://api.fixer.io/latest?symbols=USD,GBP).rates.GBP');

    // when
    const transaction = this.usingOracle.__callback('1.23', { from: otherAdddress });

    // then
    await transaction.should.be.rejectedWith(EVMRevert);
  });
});
