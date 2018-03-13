/* eslint no-console: 0 no-underscore-dangle: 0 */
const jsonHelper = require('./jsonHelper');
const getResultFromUrl = require('./getResultFromUrl');

class Oracle {
  constructor(web3, contract) {
    this.web3 = web3;
    this.contract = contract;
  }

  run() {
    this.contract.listen()
      .on('data', async (event) => {
        const { queryId, arg } = event.returnValues;
        console.log('Query', queryId, arg);
        const { url, key } = jsonHelper(arg);
        const result = await getResultFromUrl(url, key);
        this.contract.contract.methods.__callback(queryId, result)
          .send({ gas: 100000 })
          .once('transactionHash', transactionHash => console.log('Callback ', queryId, result, transactionHash));
      })
      .on('error', console.error);
  }
}

module.exports = Oracle;
