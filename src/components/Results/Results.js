import React, { Component } from 'react'

class ResultsComponent extends Component {

  render() {
    return (
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
              {this.props.movies.map((movie,index) =>{
                return (<p className="crawl-entry" key={index+1} >{index+1}. {movie.amount} ETH - {movie.name}</p>)
              })}
          </div>
        </div>
      </div>
    );
  }
}

export default ResultsComponent
