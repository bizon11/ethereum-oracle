pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract UsingMultipleOracle is Ownable {

    mapping(address => bool) public oracleAddresses;
    uint public oracles;
    uint public minAgreement;

    struct QueryResult {
        string res;
        uint count;
        mapping (address => bool) confirmedOracles;
    }

    mapping (bytes32 => bool) public queries;
    mapping (bytes32 => QueryResult) public results;


    event Query(bytes32 queryId, string arg);
    event Result(bytes32 queryId, string arg);

    modifier onlyOracle() {
        require(oracleAddresses[msg.sender]);
        _;
    }

    modifier queryExists(bytes32 _queryId) {
        require(queries[_queryId]);
        _;
    }

    modifier onlyOnceOracle(bytes32 _queryId, string _result) {
        require(!compareStrings(results[_queryId].res, _result) || !results[_queryId].confirmedOracles[msg.sender]);
        _;
    }

    function UsingMultipleOracle(uint _minAgreement, address[] _oracleAddresses) public {
        minAgreement = _minAgreement;
        for(uint i = 0; i < _oracleAddresses.length; i++) {
            oracleAddresses[_oracleAddresses[i]] = true;
        }
        oracles = _oracleAddresses.length;
    }

    function addOracleAddress(address _oracleAddress) public onlyOwner {
        oracleAddresses[_oracleAddress] = true;
        oracles++;
    }

    function removeOracleAddress(address _oracleAddress) public onlyOwner {
        require(oracleAddresses[_oracleAddress]);
        delete oracleAddresses[_oracleAddress];
        oracles--;
    }

    function query(string _arg) public returns(bytes32 queryId) {
        queryId = keccak256(now, _arg, msg.sender);
        queries[queryId] = true;
        Query(queryId, _arg);
    }

    function __callback(bytes32 _queryId, string _result) public onlyOracle onlyOnceOracle(_queryId, _result) queryExists(_queryId) {
        QueryResult storage queryResult = results[_queryId];

        if(!compareStrings(queryResult.res,_result)) {
            queryResult.res = _result;
            queryResult.count = 0;
        }

        queryResult.confirmedOracles[msg.sender] = true;
        queryResult.count++;

        if(queryResult.count >= minAgreement) {
            delete queries[_queryId];
            Result(_queryId, _result);
        }
    }

    function compareStrings (string a, string b) private pure returns (bool){
        return keccak256(a) == keccak256(b);
    }
}
