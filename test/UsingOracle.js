/* global artifacts, contract, it, beforeEach, web3 */
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
    const queryTransaction = await this.usingOracle.query('json(http://api.fixer.io/latest?symbols=USD,GBP).rates.GBP');
    const { queryId } = queryTransaction.logs[0].args;

    // when
    const transaction = this.usingOracle.__callback(queryId, '1.23', { from: oracleAddress });

    // then
    await inTransaction(transaction, 'Result');
  });

  it('should reject callback from addresses other than oracle', async () => {
    // given
    const queryTransaction = await this.usingOracle.query('json(http://api.fixer.io/latest?symbols=USD,GBP).rates.GBP');
    const { queryId } = queryTransaction.logs[0].args;

    // when
    const transaction = this.usingOracle.__callback(queryId, '1.23', { from: otherAdddress });

    // then
    await transaction.should.be.rejectedWith(EVMRevert);
  });

  it('should reject query with id which doesn\'t exist', async () => {
    // given
    const queryId = web3.sha3('whatever');

    // when
    const transaction = this.usingOracle.__callback(queryId, '1.23', { from: oracleAddress });

    // then
    await transaction.should.be.rejectedWith(EVMRevert);
  });

  it('should reject second callback with the same queryId', async () => {
    // given
    const queryTransaction = await this.usingOracle.query('json(http://api.fixer.io/latest?symbols=USD,GBP).rates.GBP');
    const { queryId } = queryTransaction.logs[0].args;
    await this.usingOracle.__callback(queryId, '1.23', { from: oracleAddress });

    // when
    const callbackTransaction = this.usingOracle.__callback(queryId, '1.23', { from: oracleAddress });

    // then
    await callbackTransaction.should.be.rejectedWith(EVMRevert);
  });
});
