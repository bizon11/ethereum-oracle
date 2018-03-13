/* global artifacts, contract, it, beforeEach */
/* eslint no-underscore-dangle: 0 */

const { inTransaction } = require('./utils/expectEvent');

const UsingOracle = artifacts.require('UsingOracle');

contract('UsingOracle', () => {
  beforeEach(async () => {
    this.usingOracle = await UsingOracle.new();
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
    const transaction = this.usingOracle.__callback('1.23');

    // then
    await inTransaction(transaction, 'Result');
  });
});
