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
      web3           : null,
      sciFiHelper    : new SciFiHelper(SciFi),
      attackerHelper : new AttackerHelper(Attacker,SciFi),
      movies         : [],
      movieData      : {
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
  }

  withdrawVotes() {
    const {sciFiHelper, web3}        = this.state;
    sciFiHelper.withdrawVotes(web3).then(()=>{
      this.getMovieList();
    })
  }

  voteForMovie() {
    const {sciFiHelper, movieData, web3} = this.state;
    sciFiHelper.vote(web3, movieData).then(()=>{
      this.getMovieList();
    })
  }

  rigTheGame() {

    const {
      attackerHelper,
      sciFiHelper,
      movieData,
      web3} = this.state;

    attackerHelper.attackSciFi(web3, movieData).then((amount)=>{
      sciFiHelper.vote(web3, movieData).then(()=>{
        this.getMovieList();
      })
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
    })
  }

  //Gets the list of movies from the smart contract and puts it in the state
  getMovieList() {
    const {sciFiHelper, web3} = this.state;
    sciFiHelper.getSortedMovies(web3).then((sortedMovies)=>{
      console.log(sortedMovies)
      this.setState({
        ...this.state, movies : sortedMovies
      })
    })
  }


  render() {
    const {movies, movieData}                      = this.state,
          {voteForMovie, handleChange, rigTheGame} = this;
          
    return (
      <div className="App">
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
                  handleChange={handleChange}
                  movieData={movieData}/>
              </div>
              <div className="col-xs-12 col-sm-4 col-md-3 col-sm-offset-4 col-md-offset-6">
                <RigComponent
                  voteForMovie={rigTheGame}
                  handleChange={handleChange}
                  movieData={movieData}/>
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
