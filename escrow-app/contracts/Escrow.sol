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

  mapping(uint256 => request) public requests;
  // создать сделку
  // для процедур, работающих через транзакцию - ничего не возвращаем
  function createRequest(bytes32 title, uint256 amount, uint256 id) {
    if (id <=0 || amount <= 0 || requests[id].id == 0) {
        throw;
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
  }
  
  // requestId- это ид созданный в функции createRequest
  // value - это процент участия в сделке
  function join(uint256 requestId, uint256 value) {
    if (requestId <=0 || value <= 0 || requests[requestId].id == 0) {
        throw;
    }

      request storage req = requests[requestId];

      if (req.usedPercentage + value <= 100) {
        req.reqProdPct.push(value);
        req.reqProdAddrB.push(bytes32(msg.sender));
        req.usedPercentage += value;
        req.paticipantsCount ++;
      }
      else {
          throw;
      }
  }
  
  //возвращает список участников по сделке
  function getParticipants(uint256 requestId) returns (bytes32[] partsLst) {
    if (requests[requestId].id > 0) {
      request storage req = requests[requestId];
      partsLst = req.reqProdAddrB;
      return partsLst;
    }
    return new bytes32[](0);
  }
  
  //возвращает список сделок
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
