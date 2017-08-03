pragma solidity ^0.4.13;

contract SciFi {

  //events
  event PaymentCalled(address payee, uint amount);
  event CreateNewMovie(address buyer, uint amount, bytes32 name);
  event UpdateExistingMovie(address buyer, uint amount, bytes32 name);
  event TokensTransfered(address from, address to, uint amount);
  event InsufficientFunds(uint bal);

  // voter struct to use in movies
  struct Voter {
    address bidder;
    uint value;
  }

  // movie struct containing all movie information
  struct Movie {
      bytes32 name;
      uint score;
      uint numVotes;
      mapping (uint => Voter) votes;
  }

  // counter for the number of movies
  uint public numMovies;

  // mapping of movies
  mapping (uint => Movie) public movies;

  // "extra fast storage" (which is used in the exploit)
  // to retreive a users balance
  mapping (address => uint) public balances;

  function vote(bytes32 name) payable {

    if (msg.value==0) // if the message has no value, do nothing.
      return;

    // update user balance for "fast access"
    balances[msg.sender] += msg.value;

    uint movieNum = 0;
    for (uint i=1; i < numMovies; i++ ) { //find movie
      if (movies[i].name == name) {
        movieNum = i;
      }
    }
    if (movieNum == 0 ) { // no movie found: create new movie
      numMovies++;
      movies[numMovies]          = Movie(name, msg.value, 1);
      movies[numMovies].votes[1] = Voter(msg.sender, msg.value);
      movieNum                   = numMovies;
      CreateNewMovie(msg.sender, msg.value, name);
    } else { // update existing movie
      movies[movieNum]
        .votes[movies[movieNum].numVotes++] = Voter(msg.sender, msg.value);
      movies[movieNum].score += msg.value;
      UpdateExistingMovie(msg.sender, movies[movieNum].score , name);
    }
  }

  // get balance corresponding to address
  function getBalance (address user) returns (uint){
    uint balance = 0;

    for (uint i=1; i < numMovies; i++ ) { // find and count all user bids
      for (uint j=1; j< movies[i].numVotes; j++){
        if (movies[i].votes[j].bidder == user) {
          balance += movies[i].votes[j].value;
        }
      }

    }
    return balance;
  }

  // gets the score of a movie
  function getScore (bytes32 name) returns (uint) {
    for (uint i=1; i <= numMovies; i++ ) {
      if (movies[i].name == name) {
        return movies[i].score;
      }
    }
  }

  // withdraw senders ethereum to recipient address
  function withdraw(address _recipient) returns (bool) {
    if (balances[msg.sender] == 0){
        InsufficientFunds(balances[msg.sender]);
        revert();
    }
    PaymentCalled(_recipient, balances[msg.sender]);

    //this is vulnerable to recursion:
    if (_recipient.call.value(balances[msg.sender])()) {
        balances[msg.sender] = 0;

        // find and count all user bids and substract from votes
        for (uint i=1; i <= numMovies; i++ ) {
          for (uint j=1; j<= movies[i].numVotes; j++){
            if (movies[i].votes[j].bidder == msg.sender) {
              // redue movies score with vote value
              movies[i].score += -movies[i].votes[j].value;

              UpdateExistingMovie(
                movies[i].votes[j].bidder,
                movies[i].votes[j].value,
                movies[i].name);
            }
          }
        }
        return true;
    }
  }
}
