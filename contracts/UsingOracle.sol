pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract UsingOracle is Ownable {

    address public oracleAddress;

    event Query(string arg);
    event Result(string arg);

    modifier onlyOracle() {
        require(msg.sender == oracleAddress);
        _;
    }

    function UsingOracle(address _oracleAddress) public {
        oracleAddress = _oracleAddress;
    }

    function query(string _arg) public {
        Query(_arg);
    }

    function __callback(string _result) public onlyOracle {
        Result(_result);
    }

    function setOracleAddress(address _oracleAddress) public onlyOwner {
        oracleAddress = _oracleAddress;
    }
}
