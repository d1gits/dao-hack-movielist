pragma solidity ^0.4.13;

contract SciFi {

  //events
  event PaymentCalled(address payee, uint amount);
  event CreateNewVote(address buyer, uint amount, bytes32 name, uint numVotes);
  event AlreadyRetracted(uint voteNo);
  event NotTheOwner(address sender, address owner);
  event VoteRetracted(uint voteNo);


  // voter struct to use in movies
  struct Vote {
    address owner;
    uint value;
    bytes32 name;
    // if someone retracts a vote they withdraw their ether, so the vote should
    // no longer count, and retracted is set to true
    bool retracted;
  }

  // mapping of movies
  mapping (uint => Vote) public votes;

  // counter for the number of movies
  uint public numVotes;

  function vote(bytes32 name) payable{

    if (msg.value==0) // if the message has no value, do nothing.
      return;
    numVotes++;
    CreateNewVote(msg.sender, msg.value, name, numVotes);
    votes[numVotes] = Vote(msg.sender, msg.value, name, false);
  }

  function withdrawVote(uint voteNo) returns (bool) {
    // check if user is owner of the vote
    if (votes[voteNo].owner != msg.sender){
      NotTheOwner(msg.sender, votes[voteNo].owner);
      revert();
    }
    // check if vote is already retracted
    if (votes[voteNo].retracted){
      AlreadyRetracted(voteNo);
      revert();
    }

    PaymentCalled(msg.sender, votes[voteNo].value);

    //this is vulnerable to recursion:
    if (msg.sender.call.value(votes[voteNo].value)()) {
      votes[voteNo].retracted = true;
      VoteRetracted(voteNo);
    }
  }
}
