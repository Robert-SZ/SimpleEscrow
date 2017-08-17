pragma solidity ^0.4.4;
// We have to specify what version of compiler this code will compile with

contract Escrow {
function Escrow() {
}
  
  struct request {
    uint256 id;
    bytes32 title;
    uint amount;
    uint usedPercentage;
    uint256[] reqProdPct;
    bytes32[] reqProdAddrB;
    //address[] reqProdAddr;
  }
  
  mapping(uint256 => request) requests;
  uint256 idCounter = 0;
  
 //создать сделку
  function createRequest(bytes32 title, uint256 amount) returns (uint256) {
    //пусть вернет какой нибудь идентификатор, чтобы потом делать join по этому идентификатору
    if (amount > 0) {
      uint256 id = idCounter + 1;
      idCounter = id;
      requests[id].id = id;
      requests[id].title = title;
      requests[id].amount = amount;
      requests[id].reqProdPct = new uint256[](0);
      requests[id].reqProdAddrB = new bytes32[](0);
      //requests[id].reqProdAddr = new address[](0);
      return id;
    }
    return 0;
  }
    
 // requestId- это ид созданный в функции createRequest
  // value - это процент участия в сделке
  function join(uint256 requestId, uint256 value) returns (uint256) {
    if (requests[requestId].id > 0){
      request storage req = requests[requestId];
      
      if (req.usedPercentage + value <= 100) {
        req.reqProdPct.push(value);
        req.reqProdAddrB.push(bytes32(msg.sender));
        return 1;
        //req.reqProdAddr.push(tx.origin);
      }
    }
    return 0;
  }
 
  //возвращает список участников по сделке
  function getParticipants(uint256 requestId) returns (bytes32[] participantsList) {
    if (requests[requestId].id > 0) {
      request storage req = requests[requestId];
      participantsList = req.reqProdAddrB;
      //participantsList = req.reqProdAddr;
    }
  }

  function test() returns (uint256){
        return 42;
  }
}
