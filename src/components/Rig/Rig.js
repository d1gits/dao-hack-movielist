import React, { Component } from 'react'

class RigComponent extends Component {

  render() {
    const {handleChange, rigTheGame} = this.props;

    return (
			<div className="content-box">
				<div className="content-box--title" >Rig the game</div>
				<p className="content-box--explanation">You can also just rig the game by using this contract. It allows you to steal whatever is in the contract and then you can just re-allocate that money to your favorite movie!</p>
					<form onSubmit={rigTheGame} name="rig">
						<button type="submit" className="btn btn-default">Steal eth!</button>
					</form>
			</div>
    );
  }
}

export default RigComponent
