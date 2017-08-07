pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SciFi.sol";

contract TestSciFi {

  uint public initialBalance = 3 ether;
  bool public gotPaid = false;

  // define the default function, so that we can check if we're being paid
  function () payable {
    gotPaid = true;
  }

  // voter struct to use in movies
  struct Voter {
    address bidder;
    uint value;
  }

  function testVote() {
    SciFi sciFi = SciFi(DeployedAddresses.SciFi());

    bytes32 movieName = 'Return of the Jedi';
    uint amount       = 100000000000000000;

    sciFi.vote.value(amount)(movieName);
    uint voteNo = sciFi.numVotes();

    // define variables to be able to read a vote
    address owner;
    uint value;
    bytes32 name;
    bool retracted;

    // get the vote
    (owner, value, name, retracted) = sciFi.votes(voteNo);

    Assert.equal(value, amount, "Requesting the bids for Return of the Jedi should return 100000000000000000");
  }

  function testRetractVote() {
    SciFi sciFi = SciFi(DeployedAddresses.SciFi());

    bytes32 movie       = 'Random movie';
    uint amount         = 100000000000000000;

    sciFi.vote.value(amount)(movie);
    uint voteNo = sciFi.numVotes();
    sciFi.withdrawVote(voteNo);

    Assert.equal(gotPaid, true, "The contract should have received some money");
  }

}
