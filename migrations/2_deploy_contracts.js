var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var SciFi = artifacts.require("./SciFi.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(SciFi);
};
