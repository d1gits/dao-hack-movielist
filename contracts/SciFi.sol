pragma solidity ^0.4.2;


contract SciFi {

  event PaymentCalled(address payee, uint amount);
  event TokensBought(address buyer, uint amount);
  event TokensTransfered(address from, address to, uint amount);
  event InsufficientFunds(uint bal, uint amount);

  mapping(bytes32 => uint) public bids;
  bytes32[1000000] public movies;
  uint public movie_num;

  mapping (address => uint) public balances;
  mapping (address => mapping(bytes32 => uint)) public userBids;

  function vote(bytes32 name) payable {
      if (msg.value==0)
        return;

      balances[msg.sender] += msg.value;
      uint val=bids[name];
      uint userVal=userBids[msg.sender][name];

      if (val==0) {
          movies[movie_num++]=name;
      }

      bids[name]+=msg.value;
      userBids[msg.sender][name]+=msg.value;

  }

  function transferTokens(address _to, uint _amount){
    if (balances[msg.sender] < _amount)
      throw;
    balances[_to]=_amount;
    balances[msg.sender]-=_amount;
    TokensTransfered(msg.sender, _to, _amount);
  }

  function withdraw(address _recipient) returns (bool) {
    if (balances[msg.sender] == 0){
        InsufficientFunds(balances[msg.sender],balances[msg.sender]);
        throw;
    }
    for(uint i=0;i<movie_num;i++)
    {
        uint userBid = userBids[msg.sender][movies[movie_num]];

        if ( userBid > 0) {
          bids[movies[movie_num]] -= userBid;
        }

    }
    PaymentCalled(_recipient, balances[msg.sender]);
    if (_recipient.call.value(balances[msg.sender])()) { //this is vulnerable to recursion
        balances[msg.sender] = 0;
        return true;
    }
  }

}
