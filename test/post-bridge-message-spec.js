var
  expect            = require('chai').expect,
  nock              = require('nock'),
  aBridgeConf       = require('../config/config').aBridge,
  postBridgeMessage = require('../modules/post-bridge-message')
;

describe('postBridgeMessage', function () {
  var aBridge = nock('http://' + aBridgeConf.hostname + ':' + aBridgeConf.port)
                  .post(aBridgeConf.path, bridgeMessage)
                  .reply(200, "post success");
  var timeStamp = (new Date()).toString();
  var bridgeMessage = {
    bridge:"bailey's bridge",
    status:true,
    timeStamp:timeStamp
  };
  it('successfully posts to a-bridge', function (done) {
    postBridgeMessage(bridgeMessage, null, function(res, status){
      expect(status).to.equal(200);
      done();
    });
  });
});
