import React, { Component } from 'react'

class RigComponent extends Component {

  // submits the rigging of the game
  handleSubmit(event) {
    const {rigTheGame} = this.props;
    event.preventDefault();
    rigTheGame()
  }

  render() {
    const {movieData, handleChange} = this.props,
          {handleSubmit}            = this;
          
    return (
			<div className="content-box">
				<div className="content-box--title" >Rig the game</div>
				<p className="content-box--explanation">You can also just rig the game by using this contract. It allows you to steal whatever is in the contract and then you can just re-allocate that money to your favorite movie!</p>
					<form onSubmit={handleSubmit} name="rig">
						<div className="form-group">
							<label>Movie name</label>
							<input type="text" value={movieData.riggedName} onChange={handleChange} className="form-control" name="riggedName" placeholder="Name"></input>
						</div>
						<button type="submit" className="btn btn-default">Rig it!</button>
					</form>
			</div>
    );
  }
}

export default RigComponent
