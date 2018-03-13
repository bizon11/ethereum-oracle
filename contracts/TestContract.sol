pragma solidity ^0.4.19;

import "./UsingOracle.sol";


contract TestContract is UsingOracle {
    string public result;

    function TestContract(address _oracleAddress) UsingOracle(_oracleAddress) public {}

    function checkNew() public {
        query("json(http://api.fixer.io/latest?symbols=USD,GBP).rates.GBP");
    }

    function __callback(bytes32 _queryId, string _result) public {
        super.__callback(_queryId, _result);
        result = _result;
    }
}
