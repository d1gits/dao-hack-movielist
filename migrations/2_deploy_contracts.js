var SciFi = artifacts.require("./SciFi.sol");
var Attacker = artifacts.require("./Attacker.sol");

module.exports = function(deployer) {
  deployer.deploy(SciFi);
  deployer.deploy(Attacker);
};
