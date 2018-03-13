/* global artifacts, contract, beforeEach, it */
/* eslint no-underscore-dangle: 0 */

require('chai').should();

const TestContract = artifacts.require('TestContract');

contract('TestContract', (accounts) => {
  const oracleAddress = accounts[1];

  beforeEach(async () => {
    this.testContract = await TestContract.new(oracleAddress);
  });

  it('should update result to 1.23', async () => {
    // given
    const resultBefore = await this.testContract.result();
    await resultBefore.should.not.equal('1.23');

    // when
    await this.testContract.checkNew();
    await this.testContract.__callback('1.23', { from: oracleAddress });

    // then
    const resultAfter = await this.testContract.result();
    await resultAfter.should.equal('1.23');
  });
});
