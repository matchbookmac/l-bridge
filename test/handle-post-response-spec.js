var
  expect            = require('chai').expect,
  nock              = require('nock'),
  aBridgeConf       = require('../config/config').aBridge,
  postBridgeMessage = require('../modules/post-bridge-message'),
  handlePostResponse = require('../modules/handle-post-response')
;

describe('postBridgeMessage', function () {
  var aBridge = nock('http://' + aBridgeConf.hostname + ':' + aBridgeConf.port);
  var timeStamp = (new Date()).toString();
  var bridgeMessage = {
    bridge:"bailey's bridge",
    status:true,
    timeStamp:timeStamp
  };
  var alteredMessage = {
    bridge:"bailey's bridge",
    status:true,
    timeStamp:"foo"
  };
  var incompleteMessage = {
    bridge:"bailey's bridge",
    status:true,
  };

  // HTTP 200 Success
  aBridge.post(aBridgeConf.path, bridgeMessage)
          .reply(200, "post success");
  // HTTP 400 Errors
  aBridge.post(aBridgeConf.path, alteredMessage)
          .reply(400, "post fail bad message");
  aBridge.post(aBridgeConf.path, incompleteMessage)
          .reply(400, "post fail not enough message");
  // HTTP 404 Error
  aBridge.post('/incoming', bridgeMessage)
          .reply(404, "wrong place, brah");
  // HTTP 500 Error
  aBridge.post(aBridgeConf.path, { absolute: "bollocks" })
          .reply(500, "my bad");

  // HTTP 200 Test
  it('successfully posts to a-bridge', function (done) {
    var postStatus;
    postBridgeMessage(bridgeMessage, null, function(res, status){
      postStatus = status.toString();
      var that = this;
      handlePostResponse[postStatus].call(that, bridgeMessage, function () {
        done();
      });
    });
  });
  // HTTP 400 Test
  it('errors if the message is not valid', function (done) {
    postBridgeMessage(alteredMessage, null, function(res, status){
      expect(status).to.equal(400);
      done();
    });
  });
  // HTTP 400 Test
  it('errors if the message is incomplete', function (done) {
    postBridgeMessage(incompleteMessage, null, function(res, status){
      expect(status).to.equal(400);
      done();
    });
  });
  // HTTP 404 Test
  it('errors if the path is incorrect', function (done) {
    postBridgeMessage(bridgeMessage, { path: "/incoming" }, function(res, status){
      expect(status).to.equal(404);
      done();
    });
  });
  // HTTP 500 Test
  it('errors if the message is incomplete', function (done) {
    postBridgeMessage({ absolute: "bollocks" }, null, function(res, status){
      expect(status).to.equal(500);
      done();
    });
  });
});
