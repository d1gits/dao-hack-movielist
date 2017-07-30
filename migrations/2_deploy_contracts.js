var SciFi = artifacts.require("./SciFi.sol");
var dumbDAO = artifacts.require("./dumbDAO.sol");
var Attacker = artifacts.require("./Attacker.sol");

module.exports = function(deployer) {
  deployer.deploy(SciFi);
  deployer.deploy(dumbDAO);
  deployer.deploy(Attacker);
};
