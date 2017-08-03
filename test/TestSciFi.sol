pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SciFi.sol";

contract TestSciFi {
  event balanceUpdate(uint balance);
  uint public initialBalance = 3 ether;

  // voter struct to use in movies
  struct Voter {
    address bidder;
    uint value;
  }

  function testVote() {
    SciFi sciFi = SciFi(DeployedAddresses.SciFi());

    bytes32 movieName = 'Return of the Jedi';
    uint amount       = 100000000000000000;
    uint initialScore = sciFi.getScore(movieName);

    sciFi.vote.value(amount)(movieName);

    uint score = sciFi.getScore(movieName);

    Assert.equal(score ,initialScore + amount, "Requesting the bids for Return of the Jedi should return 10000");
  }

  function testRetractVote() {
    SciFi sciFi = SciFi(DeployedAddresses.SciFi());

    bytes32 movie       = 'Random movie';
    uint amount         = 100000000000000000;
    uint gas            = 100000000000000000;
    uint initialBalance = this.balance;

    sciFi.vote.value(amount)(movie);
    sciFi.withdraw(this);

    Assert.isAtLeast(this.balance, initialBalance - gas, "The contracts balance should equal its initial balance minus gas");
  }

}
