pragma solidity ^0.4.4;
// We have to specify what version of compiler this code will compile with

contract Escrow {
function Escrow() { }

  struct request {
    uint256 id;
    bytes32 title;
    uint amount;
    uint usedPercentage;
    uint paticipantsCount;
    uint256[] reqProdPct;
    bytes32[] reqProdAddrB;
  }

  // main requests storage
  mapping(uint256 => request) public requests;
  // transaction results storage
  mapping(address => uint) public txlog;

  // create deal
  // contract implements publish requests to blockchain
  // Transaction execution result are logged to txlog
  // title  -  a short description
  // amount - amount of money (eth) to be put by each side to escrow
  // id - deal id, generate outside. Required to get deal info later.
  function createRequest(bytes32 title, uint256 amount, uint256 id) {
    if (id <= 0){
        txlog[msg.sender] = 1;
        return;
    }
    
    if (amount <= 0){
        txlog[msg.sender] = 2;
        return;
    }
    
    if (requests[id].id > 0){
        txlog[msg.sender] = 3;
        return;
    }
    
    requests[id] = request({
        id: id,
        title: title,
        amount: amount,
        usedPercentage: 0,
        reqProdPct: new uint256[](0),
        reqProdAddrB: new bytes32[](0),
        paticipantsCount: 0
    });
    
    txlog[msg.sender] = 10;
  }

  // Allow to join sellers to the request with checking of edge cases
  // Transaction execution result are logged to txlog
  // requestId- id created in createRequest function
  // value - participating value offered by seller
  function join(uint256 requestId, uint256 value) {
    if (requestId <= 0){
        txlog[msg.sender] = 1;
        return;
    }
    
    if (value <= 0){
        txlog[msg.sender] = 4;
        return;
    }
    
    if (value > 100){
        txlog[msg.sender] = 5;
        return;
    }

    request storage req = requests[requestId];
    
    if (req.id <= 0){
        txlog[msg.sender] = 6;
        return;
    }


    if (req.usedPercentage + value > 100){
        txlog[msg.sender] = 7;
        return;
    }

    req.reqProdPct.push(value);
    req.reqProdAddrB.push(bytes32(msg.sender));
    req.usedPercentage += value;
    req.paticipantsCount ++;
    
    txlog[msg.sender] = 10;
  }
  
  //not used
  function getParticipants(uint256 requestId) returns (bytes32[] partsLst) {
    if (requests[requestId].id > 0) {
      request storage req = requests[requestId];
      partsLst = req.reqProdAddrB;
      return partsLst;
    }
    return new bytes32[](0);
  }
  
  //returns deals ids list
  function getRequestsInfo() returns (uint256[] requestsList) {
    requestsList = new uint256[](0);
    uint256 i = 1;
    while (requests[i].id > 0) {
        var tmp = new uint256[](requestsList.length + 1);
        for (uint j = 0; j < requestsList.length; j++)
            tmp[j] = requestsList[j];

        tmp[i-1] = requests[i].id;

        requestsList = tmp;

        i++;
    }
    return requestsList;
  }
}
