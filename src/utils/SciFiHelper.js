class SciFiHelper {

  constructor(SciFiContract) {
    this.contract = SciFiContract;

    // bindings
    this.recursiveGetMovie = this.recursiveGetMovie.bind(this)
    this.vote              = this.vote.bind(this)
    this.withdrawVotes     = this.withdrawVotes.bind(this)
    this.recursiveWithdraw = this.recursiveWithdraw.bind(this)
    this.getSortedMovies   = this.getSortedMovies.bind(this)

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
          return SciFiInstance.vote(
            hexMovieName,
            {from: accounts[0], gas:200000, value: web3.toWei(amount,'ether')
        }).then((result) => {
            resolve();
          })
        })
      })
    })
  }

  // returns a recursive promise building a list of all movies
  recursiveWithdraw(movies, i, numVotes, SciFiInstance, accounts, web3) {
    return SciFiInstance.votes(i).then((result)=>{

      const owner    = result[0].toString(),
            retracted = result[3];

      return new Promise((resolve, reject) => {
        if(!retracted && owner === accounts[0]) {
          return SciFiInstance.withdrawVote(
            i,
            {from: accounts[0], gas:200000}).then(()=>{
              resolve()
            })
        } else {
          resolve()
        }
      }).then(()=>{
        // get the next movie if we're not finished, otherwise: return the movies
        if (i === numVotes) {
          return;
        } else {
          return this.recursiveWithdraw(movies, i+1, numVotes, SciFiInstance, accounts, web3);
        }
      })


    })
  }


  withdrawVotes(web3) {
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
          return SciFiInstance.numVotes()

          .then((result) => {

            let numVotes = result.c[0];
            let movies = [];
            // console.log(numVotes)
            return this.recursiveWithdraw(movies, 1, numVotes, SciFiInstance, accounts, web3)
            .then(() => {
              // resolve the initial promise with a sorted list of movies
              resolve();
            });
          })
        })
      })
    })
  }

  // returns a recursive promise building a list of all movies
  recursiveGetMovie(movies, i, numVotes, SciFiInstance, web3) {
    return SciFiInstance.votes(i).then((result)=>{

      const amount    = result[1].c[0],
            hexname   = result[2],
            retracted = result[3];

      if(!retracted) {
        // check if movie exists
        if(movies.find((movie)=>{ return movie.name === web3.toAscii(hexname) })){
          // adjust movie
          const objIndex = movies.findIndex((movie)=>{ return movie.name === web3.toAscii(hexname)})
          movies[objIndex].amount += amount/10000

        } else {
          // new movie
          movies = [...movies, {
            name   : web3.toAscii(hexname),
            amount : parseFloat(amount/10000)}
          ]
        }
      }

      // get the next movie if we're not finished, otherwise: return the movies
      if (i === numVotes) {
        return movies;
      } else {
        return this.recursiveGetMovie(movies, i+1, numVotes, SciFiInstance, web3);
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
          return SciFiInstance.numVotes()

          .then((result) => {

            let numVotes = result.c[0];
            let movies = [];
            // console.log(numVotes)
            return this.recursiveGetMovie(movies, 1, numVotes, SciFiInstance, web3)
            .then((allMovies) => {
              // sort the movies
              let sortedMovies = allMovies.sort(
                function(a,b){
                  return ((a.amount > b.amount)?-1:((a.amount < b.amount)?1:0))
                });
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
