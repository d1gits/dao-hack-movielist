import React, { Component } from 'react'
import SciFiContract from '../build/contracts/SciFi.json'
import AttackerContract from '../build/contracts/attacker.json'
import getWeb3 from './utils/getWeb3'
import SciFiHelper from './utils/SciFiHelper'
import AttackerHelper from './utils/AttackerHelper'

//components
import VoteComponent from './components/Vote'
import RigComponent from './components/Rig'
import ResultsComponent from './components/Results'

//styling stuff
import './css/oswald.css'
import './css/open-sans.css'
import './css/star-wars.css'
import './css/flexboxgrid.min.css'
import './css/custom-bootstrap/bootstrap-theme.min.css'
import './css/custom-bootstrap/bootstrap.min.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    const contract = require('truffle-contract'),
         SciFi     = contract(SciFiContract),
         Attacker  = contract(AttackerContract);

    this.state = {
      web3            : null,
      sciFiHelper     : new SciFiHelper(SciFi),
      attackerHelper  : new AttackerHelper(Attacker,SciFi),
      movies          : [],
      balance         : 0,
      movieData       : {
        movieName  : '',
        amount     : 0,
        riggedName : ''
      }
    }

    // bindings
    this.handleChange   = this.handleChange.bind(this)
    this.voteForMovie   = this.voteForMovie.bind(this)
    this.withdrawVotes  = this.withdrawVotes.bind(this)
    this.rigTheGame     = this.rigTheGame.bind(this)
    this.getMovieList   = this.getMovieList.bind(this)
    this.updateBalance   = this.updateBalance.bind(this)

  }

  withdrawVotes(event) {
    event.preventDefault()
    const {sciFiHelper, web3}        = this.state;
    sciFiHelper.withdrawVotes(web3).then(()=>{
      this.getMovieList();
    })
  }

  voteForMovie(event) {
    event.preventDefault()
    const {sciFiHelper, movieData, web3} = this.state;
    sciFiHelper.vote(web3, movieData).then(()=>{
      this.getMovieList();
    })
  }

  rigTheGame(event) {
    event.preventDefault();
    const {
      attackerHelper,
      sciFiHelper,
      movieData,
      web3} = this.state;

    attackerHelper.attackSciFi(web3, movieData).then(()=>{
      this.getMovieList();
    })
  }

  handleChange(event) {

    const {value, name} = event.target
    const {movieData}   = this.state

    if (name === "movieName") {
      this.setState({...this.state, movieData : {...movieData, movieName:value}})
    } else if (name === "amount") {
      this.setState({...this.state, movieData : {...movieData, amount:value}})
    } else {
      this.setState({...this.state, movieData : {...movieData, riggedName:value}})
    }

  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
    .then( () =>{
      // Get the movie list once web3 is provided
      this.getMovieList()
      // Update user balance once web3 is provided
      this.updateBalance()
    })
  }

  //Gets the list of movies from the smart contract and puts it in the state
  getMovieList() {
    const {sciFiHelper, web3} = this.state,
          {updateBalance}     = this;
    sciFiHelper.getSortedMovies(web3).then((sortedMovies)=>{
      console.log(sortedMovies)
      this.setState({
        ...this.state, movies : sortedMovies
      })
      updateBalance()
    })
  }

  updateBalance() {
    const {web3} = this.state;
    this.setState({
      ...this.state,
      balance : web3.eth.getBalance(web3.eth.accounts[0]).c[0]/10000
    })
  }

  render() {
    const {movies, balance}                      = this.state,
          {voteForMovie, handleChange, rigTheGame, withdrawVotes} = this;

    return (
      <div className="App">
        <div className="balanceBox">Your Balance: {balance} ETH</div>
        <div className="row">
            <div className="col-xs-12">
                <div className="starwars-title">The Ultimate Sci-Fi Movie list</div>
            </div>
        </div>
        <div className="container">
          <div className="row">
              <div className="col-xs-12 col-sm-4 col-md-3">
                <VoteComponent
                  voteForMovie={voteForMovie}
                  withdrawVotes={withdrawVotes}
                  handleChange={handleChange}/>
              </div>
              <div className="col-xs-12 col-sm-4 col-md-3 col-sm-offset-4 col-md-offset-6">
                <RigComponent
                  rigTheGame={rigTheGame}
                  handleChange={handleChange}/>
              </div>
          </div>
        </div>
        <div className="fade"></div>
        <ResultsComponent movies={movies}/>
      </div>
    );
  }
}

export default App
