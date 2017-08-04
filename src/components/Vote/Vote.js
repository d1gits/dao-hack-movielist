import React, { Component } from 'react'

class VoteComponent extends Component {

  render() {
    const {handleChange, voteForMovie, withdrawVotes} = this.props;

    return (
      <div className="content-box">
        <div className="content-box--title" >Vote Here</div>
          <p className="content-box--explanation">To vote, transfer some ether to the contract with the correct movie name. If someone already put it in the list, be sure to use the exact same spelling so your votes count together!</p>
          <form onSubmit={voteForMovie} name="vote" >
            <div className="form-group">
              <label>Movie name</label>
              <input type="text" onChange={handleChange} className="form-control" name="movieName" placeholder="Name"></input>
            </div>
            <div className="form-group">
              <label>Amount of Ether</label>
              <input type="number" step="0.0001" onChange={handleChange} className="form-control" name="amount" placeholder="Amount"></input>
            </div>
            <button type="submit" className="btn btn-default">Vote!</button>
          </form>
          <p className="content-box--explanation">Didn't vote for Starwars? Click here to withdraw your votes and adjust accordingly:</p>
          <form onSubmit={withdrawVotes} name="withdraw" >
            <button type="submit" className="btn btn-danger">Whithdraw votes</button>
          </form>
      </div>
    );
  }
}

export default VoteComponent
