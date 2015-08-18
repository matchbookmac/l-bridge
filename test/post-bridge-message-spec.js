var
  expect            = require('chai').expect,
  nock              = require('nock'),
  aBridgeConf       = require('../config/config').aBridge,
  postBridgeMessage = require('../modules/post-bridge-message')
;

describe('postBridgeMessage', function () {
  it('successfully posts to a-bridge', function (done) {
    var timeStamp = (new Date()).toString();
    var bridgeMessage = {
      bridge:"bailey's bridge",
      status:true,
      timeStamp:timeStamp
    };
    var aBridge = nock('http://' + aBridgeConf.hostname + ':' + aBridgeConf.port)
                    .post(aBridgeConf.path, bridgeMessage)
                    .reply(200, "post success");
    postBridgeMessage(bridgeMessage, null, function(err, res, status){
      expect(status).to.equal(200);
      done();
    });
  });
  after(function clearNock(done) {
    nock.cleanAll();
    done();
  });
});
