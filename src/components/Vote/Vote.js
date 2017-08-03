import React, { Component } from 'react'

class VoteComponent extends Component {
  constructor(props) {
    super(props)
  }


  handleSubmit(event) {
    const {voteForMovie } = this.props;
    event.preventDefault();
    voteForMovie()
  }

  render() {
    return (
      <div className="content-box">
        <div className="content-box--title" >Vote Here</div>
          <p className="content-box--explanation">To vote, transfer some ether to the contract with the correct movie name. If someone already put it in the list, be sure to use the exact same spelling so your votes count together!</p>
          <form onSubmit={this.handleSubmit} name="vote" >
            <div className="form-group">
              <label>Movie name</label>
              <input type="text" value={this.props.movieData.movieName} onChange={this.props.handleChange} className="form-control" name="movieName" placeholder="Name"></input>
            </div>
            <div className="form-group">
              <label>Amount of Ether</label>
              <input type="number" step="0.0001" value={this.props.movieData.amount} onChange={this.props.handleChange} className="form-control" name="amount" placeholder="Amount"></input>
            </div>
            <button type="submit" className="btn btn-default">Vote!</button>
          </form>
          <p className="content-box--explanation">Didn't vote for Starwars? Click here to withdraw your votes and adjust accordingly:</p>
          <form onSubmit={this.handleSubmit} name="withdraw" >
            <button type="submit" className="btn btn-danger">Whithdraw votes</button>
          </form>
      </div>
    );
  }
}

export default VoteComponent
