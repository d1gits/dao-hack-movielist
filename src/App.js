import React, { Component } from 'react'
import SciFiContract from '../build/contracts/SciFi.json'
import AttackerContract from '../build/contracts/attacker.json'
import getWeb3 from './utils/getWeb3'
import SciFiHelper from './utils/SciFiHelper'
import AttackerHelper from './utils/AttackerHelper'

//components
import VoteComponent from './components/Vote'
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
    this.handleSubmit   = this.handleSubmit.bind(this)
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

  handleSubmit(event) {

    const {name}                                    = event.target;
    const {voteForMovie, rigTheGame, withdrawVotes} = this;

    event.preventDefault();
    if (name === "vote") {
      voteForMovie()
    } else if (name === "rig") {
      rigTheGame()
    } else if (name === "withdraw") {
      withdrawVotes()
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
    .catch((r) => {
      console.log(r);
      console.log('Error finding web3.')
    })
    .then( () =>{
      // Get the movie list once web3 is provided
      this.getMovieList()
    })
  }

  getMovieList() {
    const {sciFiHelper, movieData, web3} = this.state;
    sciFiHelper.getSortedMovies(web3).then((sortedMovies)=>{
      console.log(sortedMovies)
      this.setState({
        ...this.state, movies : sortedMovies
      })
    })

  }


  render() {
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
                <VoteComponent voteForMovie={this.voteForMovie} handleChange={this.handleChange} movieData={this.state.movieData}/>
              </div>
              <div className="col-xs-12 col-sm-4 col-md-3 col-sm-offset-4 col-md-offset-6">
                  <div className="content-box">
                    <div className="content-box--title" >Rig the game</div>
                    <p className="content-box--explanation">You can also just rig the game by using this contract. It allows you to steal whatever is in the contract and then you can just re-allocate that money to your favorite movie!</p>
                      <form onSubmit={this.handleSubmit} name="rig">
                        <div className="form-group">
                          <label>Movie name</label>
                          <input type="text" value={this.state.movieData.rigName} onChange={this.handleChange} className="form-control" name="riggedName" placeholder="Name"></input>
                        </div>
                        <button type="submit" className="btn btn-default">Rig it!</button>
                      </form>
                  </div>
              </div>
          </div>
        </div>
        <div className="fade"></div>
        <div className="starwars-container">
          <div className="star-wars">
            <div className="crawl">
              <div className="title">
                <p className="crawl-title">The Distributed version</p>
              </div>

                <p>As in any healthy plutocracy, money will decide. Vote with your Ether! </p>
                <p>Please wait until the end of the text for us to reveal the best sci-fi movie of all time or just use inspect element.</p>
                <p>We hope you're satisfied with the results, and if not please throw more money at this contract to make sure you are always right when someone asks you what the best star wars,... eeh science fiction movie of all time is.</p>
                <p>Here are the results:</p>
                {this.state.movies.map((movie,index) =>{
                  return (<p className="crawl-entry" key={index+1} >{index+1}. {movie.amount} ETH - {movie.name}</p>)
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App
