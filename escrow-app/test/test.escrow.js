contract('Escrow', function(accounts) {
  it("1: should register user request and get the request info", function() {
    return Escrow.new().then(function(escrow) {
      var id = 1;
      var from = accounts[0];

      return escrow.createRequest("bags", 10, id, { gas: 240000, from: from }).then(function() {
        //console.log(escrow.requests);
        return escrow.requests.call(id).then(function (registeredRequest){
          //console.log(registeredRequest);
          assert.equal(registeredRequest[0].valueOf().valueOf(), 1, "id should be equals to 1");
          assert.equal(web3.toUtf8(registeredRequest[1]), 'bags', "title should be equals to 'bags'");
        });
      });
    });
  });
  
  it("2: should register user request and fails to get request info at wrong id", function() {
    return Escrow.new().then(function(escrow) {
      var id = 7;
      var wrongId = 2;
      var from = accounts[0];

      return escrow.createRequest("shoes", 2, id, { gas: 240000, from: from }).then(function() {
        return escrow.requests.call(wrongId).then(function (requestWithWrongId){
          //console.log(requestWithWrongId);
          assert.equal(requestWithWrongId[0].valueOf(), 0, "id of not registered request should be 0");
          assert.equal(web3.toUtf8(requestWithWrongId[1]), '', "title of not registered request should be empty");
        });
      });
    });
  });

  it("3: should not allow join to not existed request", function() {
    return Escrow.new().then(function(escrow) {
      var from = accounts[0];

      return escrow.join(5, 40, { gas: 240000, from: from }).then(function() {
        return escrow.txlog.call(from).then(function (joinResult){
          assert.equal(joinResult.valueOf(), 6, "request shoud not be found");
        });
      });
    });
  });

  it("4: should not allow join with invalid id", function() {
    return Escrow.new().then(function(escrow) {
      var from = accounts[0];

      return escrow.join(0, 40, { gas: 240000, from: from }).then(function() {
        return escrow.txlog.call(from).then(function (joinResult){
          assert.equal(joinResult.valueOf(), 1, "expected id is invalid");
        });
      });
    });
  });

  it("5: should not found jion result without transaction", function() {
    return Escrow.new().then(function(escrow) {
      var from = accounts[0];

      return escrow.txlog.call(from).then(function (joinResult){
        assert.equal(joinResult.valueOf(), 0, "join result without transaction shoud be undefined");
      });
    });
  });

  it("6: should not allow join with invalid value", function() {
    return Escrow.new().then(function(escrow) {
      var from = accounts[0];

      return escrow.createRequest("bananas", 800, 3, { gas: 240000, from: from }).then(function() {
        return escrow.join(3, 0, { gas: 240000, from: from }).then(function() {
          return escrow.txlog.call(from).then(function (joinResult){
            assert.equal(joinResult.valueOf(), 4, "expected value is invalid");
          });
        });
      });
    });
  });

  it("7: should not allow join with too large value", function() {
    return Escrow.new().then(function(escrow) {
      var from = accounts[0];

      return escrow.createRequest("oranges", 15, 4, { gas: 240000, from: from }).then(function() {
        return escrow.join(4, 250, { gas: 240000, from: from }).then(function() {
          return escrow.txlog.call(from).then(function (joinResult){
            assert.equal(joinResult.valueOf(), 5, "expected value is invalid");
          });
        });
      });
    });
  });

  it("8: should correct register two sequential joins", function() {
    return Escrow.new().then(function(escrow) {
      var id = 8;
      var from = accounts[0];

      return escrow.createRequest("hippos", 9, id, { gas: 240000, from: from }).then(function() {
        return escrow.requests.call(id).then(function (registeredRequest){
          assert.equal(registeredRequest[0].valueOf(), id, "id should be equals to 8");
          assert.equal(web3.toUtf8(registeredRequest[1]), 'hippos', "title should be equals to 'hippos'");
          assert.equal(registeredRequest[2].valueOf(), 9, "amount should be equals to 9");
          
          return escrow.join(id, 20, { gas: 240000, from: from }).then(function() {
            return escrow.requests.call(id).then(function (requestWith1Join){
              assert.equal(requestWith1Join[3].valueOf(), 20, "usedPercentage should be equals to 20");
              assert.equal(requestWith1Join[4].valueOf(), 1, "paticipantsCount should be equals to 1");

              return escrow.join(id, 15, { gas: 240000, from: from }).then(function() {
                return escrow.requests.call(id).then(function (requestWith2Joins){
                  assert.equal(requestWith2Joins[3].valueOf(), 35, "usedPercentage should be equals to 20 + 15");
                  assert.equal(requestWith2Joins[4].valueOf(), 2, "paticipantsCount should be equals to 1 + 1");
                });  
              });
            });  
          });
        });
      });
    });
  });

  it("9: should correct return id list for registered requests", function() {
    return Escrow.new().then(function(escrow) {
      var id1 = 1;
      var id2 = 2;
      var id3 = 3;
      var from = accounts[0];

      return escrow.createRequest("stuff1", 1, id1, { gas: 240000, from: from }).then(function() {
        return escrow.createRequest("stuff2", 2, id2, { gas: 240000, from: from }).then(function() {
          return escrow.createRequest("stuff3", 3, id3, { gas: 240000, from: from }).then(function() {
            return escrow.getRequestsInfo.call().then(function (idsList){
              assert.equal(idsList[0].valueOf(), id1, "first request should have id = " + id1);
              assert.equal(idsList[1].valueOf(), id2, "second request should have id = " + id2);
              assert.equal(idsList[2].valueOf(), id3, "third request should have id = " + id3);
            });  
          });
        });
      });
    });
  });

  it("10: should lost second request`", function() {
    return Escrow.new().then(function(escrow) {
      var id1 = 1;
      var id3 = 3;
      var from = accounts[0];

      return escrow.createRequest("stuff1", 1, id1, { gas: 240000, from: from }).then(function() {
        return escrow.createRequest("stuff3", 3, id3, { gas: 240000, from: from }).then(function() {
          return escrow.getRequestsInfo.call().then(function (idsList){
            assert.equal(idsList[0].valueOf(), id1, "first request should have id = " + id1);
            assert.equal(idsList.length, 1, "second returns only first request");
          });  
        });
      });
    });
  });

});