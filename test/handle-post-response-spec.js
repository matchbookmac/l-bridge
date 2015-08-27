require('../config/logging');
var expect             = require('chai').expect;
var nock               = require('nock');
var aBridgeConf        = require('../config/config').aBridge;
var postBridgeMessage  = require('../modules/post-bridge-message');
var handlePostResponse = require('../modules/handle-post-response');
var sentinel           = require('../modules/mock-sentinel');

describe('handlePostResponse', function () {
  var mockSentinel;
  before(function createAMockSentinel(done) {
    mockSentinel = sentinel.simulate();
    done();
  });

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

  // Unfortunately, the .times(4) is essential to mock aBridge behavior
  // For a http 500 error. See the 500 error tests for more.
  // HTTP 200 Success
  aBridge.post(aBridgeConf.path, bridgeMessage)
          .times(4)
          .reply(200, "post success");
  // HTTP 400 Errors
  aBridge.post(aBridgeConf.path, alteredMessage)
          .reply(400, "post fail bad message");
  aBridge.post(aBridgeConf.path, incompleteMessage)
          .reply(400, "post fail not enough message");
  // HTTP 404 Error
  aBridge.post('/incoming', bridgeMessage)
          .reply(404, "wrong place, brah");

  // HTTP 200 Test
  it('successfully posts to a-bridge', function (done) {
    var postStatus;
    postBridgeMessage(bridgeMessage, null, function(err, res, status){
      handlePostResponse(status, bridgeMessage, function (err, status) {
        expect(status).to.equal(200);
        done();
      });
    });
  });
  // HTTP 400 Test
  it('errors if the message is not valid', function (done) {
    postBridgeMessage(alteredMessage, null, function(err, res, status){
      expect(status).to.equal(400);
      handlePostResponse(status, bridgeMessage, function (err, status) {
        expect(status).to.equal(200);
        done();
      });
    });
  });
  // HTTP 400 Test
  it('errors if the message is incomplete', function (done) {
    postBridgeMessage(incompleteMessage, null, function(err, res, status){
      expect(status).to.equal(400);
      handlePostResponse(status, bridgeMessage, function (err, status) {
        expect(status).to.equal(200);
        done();
      });
    });
  });
  // HTTP 404 Test
  it('errors if the path is incorrect', function (done) {
    postBridgeMessage(bridgeMessage, { path: "/incoming" }, function(err, res, status){
      expect(status).to.equal(404);
      handlePostResponse(status, bridgeMessage, function (err, status) {
        expect(status).to.equal(200);
        done();
      });
    });
  });
  // HTTP 500 Tests
  it('retries once and succeeds if aBridge is having a problem', function (done) {
    aBridge.post("/500-error", bridgeMessage)
            .reply(500, "my bad");
    aBridge.post(aBridgeConf.path, bridgeMessage)
            .reply(200, "post success");
    postBridgeMessage(bridgeMessage, { path: "/500-error"}, function(err, res, status){
      expect(status).to.equal(500);
      handlePostResponse(status, bridgeMessage, function (err, status) {
        expect(status).to.equal(200);
        done();
      });
    });
  });
  it('retries once, receives a different http error, then succeeds if aBridge is having a problem', function (done) {
    aBridge.post("/500-error", bridgeMessage)
            .reply(500, "my bad");
    aBridge.post(aBridgeConf.path, bridgeMessage)
            .reply(400, "post fail");
    aBridge.post(aBridgeConf.path, bridgeMessage)
            .reply(200, "post success");
    postBridgeMessage(bridgeMessage, { path: "/500-error"}, function(err, res, status){
      expect(status).to.equal(500);
      handlePostResponse(status, bridgeMessage, function (err, status) {
        expect(status).to.equal(200);
        done();
      });
    });
  });
  it('does an exponential backoff then succeeds if aBridge is having a problem', function (done) {
    this.timeout(45000);
    aBridge.post(aBridgeConf.path, bridgeMessage)
            .times(3)
            .reply(500, "my bad");
    aBridge.post(aBridgeConf.path, bridgeMessage)
            .reply(200, "post success");
    postBridgeMessage(bridgeMessage, null, function(err, res, status){
      expect(status).to.equal(500);
      handlePostResponse(status, bridgeMessage, function (err, status) {
        expect(status).to.equal(200);
        done();
      });
    });
  });
  it('does an exponential backoff then fails after 5 trys if aBridge is having a problem', function (done) {
    this.timeout(45000);
    aBridge.post(aBridgeConf.path, bridgeMessage)
            .times(6)
            .reply(500, "my bad");
    postBridgeMessage(bridgeMessage, null, function(err, res, status){
      expect(status).to.equal(500);
      handlePostResponse(status, bridgeMessage, function (err, status) {
        expect(status).to.equal(500);
        done();
      });
    });
  });
  // ECONNREFUSED tests
  it('does an exponential backoff then succeeds if connection is refused', function (done) {
    this.timeout(45000);
    var connectionError = {
      message: 'connect ECONNREFUSED',
      code: 'ECONNREFUSED',
      errno: 'ECONNREFUSED',
      syscall: 'connect'
    };
    aBridge.post(aBridgeConf.path, bridgeMessage)
            .times(3)
            .replyWithError(connectionError);
    aBridge.post(aBridgeConf.path, bridgeMessage)
            .reply(200, "post success");
    postBridgeMessage(bridgeMessage, null, function(err, res, status){
      expect(status).to.equal('ECONNREFUSED');
      handlePostResponse(status, bridgeMessage, function (err, status) {
        expect(status).to.equal(200);
        done();
      });
    });
  });
  it('does an exponential backoff then fails if connection is refused continually', function (done) {
    this.timeout(45000);
    var connectionError = {
      message: 'connect ECONNREFUSED',
      code: 'ECONNREFUSED',
      errno: 'ECONNREFUSED',
      syscall: 'connect'
    };
    aBridge.post(aBridgeConf.path, bridgeMessage)
            .times(6)
            .replyWithError(connectionError);
    postBridgeMessage(bridgeMessage, null, function(err, res, status){
      expect(status).to.equal('ECONNREFUSED');
      handlePostResponse(status, bridgeMessage, function (err, status) {
        expect(status).to.equal('ECONNREFUSED');
        done();
      });
    });
  });

  after(function shutDownMockSentinel(done) {
    mockSentinel.close();
    nock.cleanAll();
    done();
  });
});
