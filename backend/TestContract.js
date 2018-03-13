class TestContract {
  constructor(web3, abi, address) {
    this.contract = new web3.eth.Contract(abi, address, { from: web3.eth.defaultAccount });
  }

  listen() {
    return this.contract.events.Query({ fromBlock: 0 });
  }
}

module.exports = TestContract;
