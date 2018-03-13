pragma solidity ^0.4.19;

import "./UsingOracle.sol";


contract TestContract is UsingOracle {
    string public result;

    function checkNew() public {
        query('json(http://api.fixer.io/latest?symbols=USD,GBP).rates.GBP');
    }

    function __callback(string _result) public {
        result = _result;
    }
}
