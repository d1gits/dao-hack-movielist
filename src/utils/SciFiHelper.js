class SciFiHelper {

	constructor(SciFiContract) {
		this.contract = SciFiContract;

		// bindings
		this.getAllMovies    = this.getAllMovies.bind(this)
		this.vote            = this.vote.bind(this)
		this.withdrawVotes   = this.withdrawVotes.bind(this)
		this.getSortedMovies = this.getSortedMovies.bind(this)

	}

	// vote for movie
	vote (web3, movieData) {
		return new Promise((resolve, reject) => {
	    const {movieName, amount} = movieData,
	          hexMovieName        = web3.toHex(movieName),
						{contract}          = this;

	    contract.setProvider(web3.currentProvider)

			// Declaring this for later so we can chain functions on SciFi.
			var SciFiInstance

			// Get accounts.
			return web3.eth.getAccounts((error, accounts) => {
				return contract.deployed().then((instance) => {
					SciFiInstance = instance
					// vote for movie
					return SciFiInstance.vote(hexMovieName, {from: accounts[0], gas:200000, value: web3.toWei(amount,'ether')
				}).then((result) => {
						resolve();
					})
				})
			})
		})
	}

	withdrawVotes(web3) {
		return new Promise((resolve, reject) => {
	    const {contract} = this;

	    contract.setProvider(web3.currentProvider)

	    // Declaring this for later so we can chain functions on contract.
	    var SciFiInstance

	    // Get accounts.
	    return web3.eth.getAccounts((error, accounts) => {
	      return contract.deployed()
				.then((instance) => {
	        SciFiInstance = instance
					// withdaws the money and resets the votes
	        return SciFiInstance.withdraw(accounts[0],{from: accounts[0], gas:500000})
	      })
				.then((result) => {
	        resolve()
	      })
			})
		})
  }

	// returns a recursive promise building a list of all movies
	getAllMovies(movies, i, numMovies, SciFiInstance, web3) {
		return SciFiInstance.movies(i).then((result)=>{
			const hexname = result[0];
			const amount = result[1].c[0];

			// if the amount is not 0 add the movie to the list
			if (amount > 0){
				movies = [...movies, {
					name   : web3.toAscii(hexname),
					amount : parseFloat(amount/10000)}
				]
			}
			// get the next movie if we're not finished, otherwise: return the movies
			if (i === numMovies) {
				return movies;
			} else {
				return this.getAllMovies(movies, i+1, numMovies, SciFiInstance, web3);
			}
		})
	}

	// returns a sorted list of movies
	getSortedMovies(web3) {
		return new Promise((resolve, reject) => {
			const {contract} = this;
			contract.setProvider(web3.currentProvider)
	    // Declaring this for later so we can chain functions on contract.
	    let SciFiInstance
	    // Get accounts.
	    return web3.eth.getAccounts((error, accounts) => {

	      return contract.deployed().then((instance) => {
	        SciFiInstance = instance

	        // Get the value from the contract to prove it worked.
	        return SciFiInstance.numMovies()

					.then((result) => {

						let numMovies = result.c[0];
		        let movies = [];
						// console.log(numMovies)
						return this.getAllMovies(movies, 1, numMovies, SciFiInstance, web3).then((allMovies) => {
							// sort the movies
							let sortedMovies = allMovies.sort(function(a,b){return ((a.amount > b.amount)?-1:((a.amount < b.amount)?1:0))});
							// resolve the initial promise with a sorted list of movies
							resolve(sortedMovies);
						});
		      })
				})
			})
		})
	}
}

export default SciFiHelper
