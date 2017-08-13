pragma solidity ^0.4.11;
// We have to specify what version of compiler this code will compile with

contract Escrow {
  
  function Escrow() {

  }

  //создать сделку
  function createRequest(bytes32 title, bytes32 amount) returns (bytes32) {
    //пусть вернет какой нибудь идентификатор, чтобы потом делать join по этому идентификатору
  }

  // requestId- это ид созданный в функции createRequest
  // value - это процент участия в сделке
  function join(bytes32 requestId, bytes32 value) {
    
  }

  //возвращает список участников по сделке
  function getParticipants(bytes32 requestId) returns (bytes32[] participantsList) {
    
  }
}