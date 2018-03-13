pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract UsingOracle is Ownable {

    address public oracleAddress;
    mapping (bytes32 => bool) public queries;

    event Query(bytes32 queryId, string arg);
    event Result(bytes32 queryId, string arg);

    modifier onlyOracle() {
        require(msg.sender == oracleAddress);
        _;
    }

    modifier queryExists(bytes32 _queryId) {
        require(queries[_queryId]);
        _;
    }

    function UsingOracle(address _oracleAddress) public {
        oracleAddress = _oracleAddress;
    }

    function query(string _arg) public returns(bytes32 queryId) {
        queryId = keccak256(now, _arg, msg.sender);
        queries[queryId] = true;
        Query(queryId, _arg);
    }

    function __callback(bytes32 _queryId, string _result) public onlyOracle queryExists(_queryId) {
        delete queries[_queryId];
        Result(_queryId, _result);
    }

    function setOracleAddress(address _oracleAddress) public onlyOwner {
        oracleAddress = _oracleAddress;
    }
}
