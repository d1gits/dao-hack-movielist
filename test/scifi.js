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
          return instance.numVotes()
        })
        .then((voteNo)=>{
          return instance.votes(voteNo.toString())
        })
        .then((result)=>{
          // convert destructured bignumber score to a string for comparison
          return assert.equal(
            result[1].toString(),
            web3.toWei(1.234,'ether').toString(),
            "XYZ should have a 1.234 ether vote.")
        })
      })
    })
  })

  describe('Check if withdraw works', function() {
    it("...should return all my ether minus gas.", () => {
      const movieName      = 'XYZ'
      const initialBalance = web3.eth.getBalance(accounts[1])
      // this represents 0.1 Eth if we compare it to the first part of the
      // bignumber (c[0]) which is the most reasonable comparison I could
      // think of for now but there might be a better way :)
      const maxGas         = 1000

      return SciFi.deployed().then( (instance) => {
        return instance.vote(
            web3.toHex(movieName),
            {from: accounts[1], gas:200000, value: web3.toWei(1.234,'ether')
          })
          .then(() => {
            return instance.numVotes()
          })
          .then((voteNo) => {
            return instance.withdrawVote(
              voteNo,
              {from: accounts[1], gas:200000})
          })
          .then((result) => {
            const currBalance = web3.eth.getBalance(accounts[1])

            return assert.isAtMost(
              initialBalance.c[0],
              currBalance.c[0] + maxGas,
              "Got ethereum back minus gas.")
          })
      })
    })
  })

  describe('Check if withdraw works', function() {
    it("...should set the retract value to true", () => {

      const movieName      = 'XYZ'
      let voteNo;
      return SciFi.deployed().then( (instance) => {
        return instance.vote(
            web3.toHex(movieName),
            {from: accounts[1], gas:200000, value: web3.toWei(1.234,'ether')
          })
          .then(() => {
            return instance.numVotes();
          })
          .then((result) => {
            voteNo = result
            return instance.withdrawVote(
              voteNo,
              {from: accounts[1], gas:200000})
          })
          .then(() => {
            return instance.votes(voteNo.toString())
          })
          .then((result)=>{
            // convert destructured bignumber score to a string for comparison
            return assert.equal(
              result[3],
              true,
              "XYZ should have retracted set to true.")
          })
      })
    })
  })
})
