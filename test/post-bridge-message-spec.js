var
  expect            = require('chai').expect,
  nock              = require('nock'),
  postBridgeMessage = require('../modules/post-bridge-message')
;

describe('postBridgeMessage', function () {
  before(function postingToABridge() {
    var aBridge = nock('http://52.26.186.75:80')
                    .post('/incoming-snmp')
                    .reply(200, "post received")
                  ;
  });
  it('successfully posts to a-bridge', function (done) {
    var timeStamp = (new Date()).toString();
    var bridgeMessage = {
      bridge:"bailey's bridge",
      status:true,
      timeStamp:timeStamp
    }
    postBridgeMessage(bridgeMessage, function(res, status){
      expect(status).to.equal(200);
      done();
    });
  });
});
