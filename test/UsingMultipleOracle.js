/* global artifacts, contract, it, beforeEach, web3 */
/* eslint no-underscore-dangle: 0 */

const { inTransaction, notInTransaction } = require('./utils/expectEvent');
require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')())
  .should();

const EVMThrow = message => `VM Exception while processing transaction: ${message}`;
const EVMRevert = EVMThrow('revert');

const UsingMultipleOracle = artifacts.require('UsingMultipleOracle');

contract('UsingOracle', (accounts) => {
  const oracle1Address = accounts[1];
  const oracle2Address = accounts[2];
  const otherAddress = accounts[3];
  const nextOracle = accounts[4];

  beforeEach(async () => {
    this.usingMultipleOracle = await UsingMultipleOracle.new(2, [oracle1Address, oracle2Address]);
  });

  it('should emit a Query event', async () => {
    // when
    const transaction = this.usingMultipleOracle.query('json(http://api.fixer.io/latest?symbols=USD,GBP).rates.GBP');

    // then
    await inTransaction(transaction, 'Query');
  });

  it('should emit a Result event when gets 2 the same callbacks', async () => {
    // given
    const queryTransaction = await this.usingMultipleOracle.query('json(http://api.fixer.io/latest?symbols=USD,GBP).rates.GBP');
    const { queryId } = queryTransaction.logs[0].args;

    // when
    await this.usingMultipleOracle.__callback(queryId, '1.23', { from: oracle1Address });
    const transaction = this.usingMultipleOracle.__callback(queryId, '1.23', { from: oracle2Address });

    // then
    await inTransaction(transaction, 'Result');
  });

  it('should not emit a Result event when gets 2 not the same callbacks', async () => {
    // given
    const queryTransaction = await this.usingMultipleOracle.query('json(http://api.fixer.io/latest?symbols=USD,GBP).rates.GBP');
    const { queryId } = queryTransaction.logs[0].args;

    // when
    await this.usingMultipleOracle.__callback(queryId, '1.23', { from: oracle1Address });
    const transaction = this.usingMultipleOracle.__callback(queryId, '1.24', { from: oracle2Address });

    // then
    await notInTransaction(transaction, 'Result');
  });

  it('should reject callback from addresses other than oracle', async () => {
    // given
    const queryTransaction = await this.usingMultipleOracle.query('json(http://api.fixer.io/latest?symbols=USD,GBP).rates.GBP');
    const { queryId } = queryTransaction.logs[0].args;

    // when
    const transaction = this.usingMultipleOracle.__callback(queryId, '1.23', { from: otherAddress });

    // then
    await transaction.should.be.rejectedWith(EVMRevert);
  });


  it('should reject query with id which doesn\'t exist', async () => {
    // given
    const queryId = web3.sha3('whatever');

    // when
    const transaction = this.usingMultipleOracle.__callback(queryId, '1.23', { from: oracle1Address });

    // then
    await transaction.should.be.rejectedWith(EVMRevert);
  });

  it('should reject second callback with the same queryId from the same oracle', async () => {
    // given
    const queryTransaction = await this.usingMultipleOracle.query('json(http://api.fixer.io/latest?symbols=USD,GBP).rates.GBP');
    const { queryId } = queryTransaction.logs[0].args;
    await this.usingMultipleOracle.__callback(queryId, '1.23', { from: oracle1Address });

    // when
    const callbackTransaction = this.usingMultipleOracle.__callback(queryId, '1.23', { from: oracle1Address });

    // then
    await callbackTransaction.should.be.rejectedWith(EVMRevert);
  });

  it('should add new oracle to oracles set', async () => {
    // when
    await this.usingMultipleOracle.addOracleAddress(nextOracle);

    // then
    const oraclesCount = await this.usingMultipleOracle.oracles();
    oraclesCount.should.be.bignumber.equal(3);
  });

  it('should remove oracle from oracles set', async () => {
    // when
    await this.usingMultipleOracle.removeOracleAddress(oracle1Address);

    // then
    const oraclesCount = await this.usingMultipleOracle.oracles();
    oraclesCount.should.be.bignumber.equal(1);
  });
});
