import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'

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

    this.state = {
      storageValue: 0,
      web3: null
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

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(5, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
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
                  <div className="content-box">
                    <div className="content-box--title" >Vote Here</div>
                      <p className="content-box--explanation">To vote, simply wire some ether to the contract with the correct name. If someone already put it in the list, be sure to use the exact same spelling so your votes count together!</p>
                      <form>
                        <div className="form-group">
                          <label for="movieNameVote">Movie name</label>
                          <input type="text" className="form-control" id="movieNameVote" placeholder="Name"></input>
                        </div>
                        <div className="form-group">
                          <label for="amount">Amount of Ether</label>
                          <input type="text" className="form-control" id="amount" placeholder="Amount"></input>
                        </div>
                        <button type="submit" className="btn btn-default">Vote!</button>
                      </form>
                  </div>
              </div>
              <div className="col-xs-12 col-sm-4 col-md-3 col-sm-offset-4 col-md-offset-6">
                  <div className="content-box">
                    <div className="content-box--title" >Rig the game</div>
                    <p className="content-box--explanation">You can also just rig the game by injecting this contract. It allows you to steal whatever is in the contract and then you can just re-allocate that money to your favorite movie!</p>
                      <form>
                        <div className="form-group">
                          <label for="movieNameRig">Movie name</label>
                          <input type="text" className="form-control" id="movieNameRig" placeholder="Name"></input>
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

                <p>1. Independence day: 10.5 ETH Wasted</p>
                <p>1. Independence day: 10.5 ETH Wasted</p>
                <p>1. Independence day: 10.5 ETH Wasted</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App
