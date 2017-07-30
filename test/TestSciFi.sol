pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SciFi.sol";

contract TestSciFi {

  uint public initialBalance = 1 ether;

  function testVote() {
    SciFi sciFi = SciFi(DeployedAddresses.SciFi());

    bytes32 movie = 'Return of the Jedi';
    uint amount = 10000;

    sciFi.vote.value(amount)(movie);
    Assert.equal(sciFi.bids(movie), amount, "Requesting the bids for Return of the Jedi should return 10000");
  }

}
