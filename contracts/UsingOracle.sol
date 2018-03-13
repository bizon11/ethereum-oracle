pragma solidity ^0.4.19;


contract UsingOracle {

    event Query(string arg);
    event Result(string arg);

    function query(string _arg) public {
        Query(_arg);
    }

    function __callback(string _result) public {
        Result(_result);
    }
}
