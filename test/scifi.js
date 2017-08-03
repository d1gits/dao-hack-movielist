var SciFi = artifacts.require("./SciFi.sol")
contract('SciFi', (accounts) => {

  describe('Check if vote is registered correctly', function() {

    it("...should record the right amount ether for a vote.", () => {

      const movieName = 'XYZ';

      return SciFi.deployed().then( (instance) => {
        return instance.vote(
          web3.toHex(movieName),
          {from: accounts[0], gas:200000, value: web3.toWei(1.234,'ether')
        })
        .then(() => {
          return instance.movies(1).then((result)=>{
            // convert destructured bignumber score to a string for comparison
            return assert.equal(
              result[1].toString(),
              web3.toWei(1.234,'ether').toString(),
              "XYZ should have a 1.234 ether vote.");
          })
        })
      })
    })
  })
