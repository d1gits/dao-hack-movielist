pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/dumbDAO.sol";
import "../contracts/Attacker.sol";

contract TestAttack {

  uint public initialBalance = 10 ether;

  function testAttack() {
		uint weiToBeStolen = 50000;
		uint weiToUseForStealing = 50000;

		dumbDAO dumbdao = dumbDAO(DeployedAddresses.dumbDAO());
	  Attacker attacker = Attacker(DeployedAddresses.attacker());


		dumbdao.buyTokens.value(weiToBeStolen)();

		attacker.setDAOAddress(DeployedAddresses.dumbDAO());
		attacker.fundMe.value(weiToUseForStealing)();
		attacker.buyDAOTokens(weiToUseForStealing);
		attacker.stealEth();

		uint attackerWei = weiToBeStolen + weiToUseForStealing;
    Assert.equal(attacker.balance, attackerWei, "Requesting the bids for Return of the Jedi should return 10000");
  }

}
