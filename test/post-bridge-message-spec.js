var
  expect            = require('chai').expect,
  nock              = require('nock'),
  postBridgeMessage = require('../modules/post-bridge-message')
;

describe('postBridgeMessage', function () {
  before(function postingToABridge() {
    var regEx   = new RegExp("'\\{\"bridge\":\"[\\\\a-z'\\s]+\",\"status\":(false|true),\"timeStamp\":\"[\\w\\s\\:\\-\\(\\)]+\"\\}'", "g");
    var aBridge = nock('http://52.26.186.75:80')
                    .post('/incoming-snmp', regEx)
                    .reply(200, "post received")
                  ;
  });
  it('successfully posts to a-bridge', function (done) {
    var timeStamp = (new Date()).toString();
    var bridgeMessage = {
      bridge:"bailey's bridge",
      status:true,
      timeStamp:timeStamp
    };
    postBridgeMessage(bridgeMessage, function(res, status){
console.log(res);
      expect(status).to.equal(200);
      expect(res).to.be.a('string');
      done();
    });
  });
});
(function (stuff) {
  this._ = true;
  console.log(this._);
})();
console.log(this._);
// '\{"bridge":"[\\a-z'\s]+","status":(false|true),"timeStamp":"[\w\s\:\-\(\)]+"\}'

// '\{ bridge: [\\a-z'\s]+,\\n\s+status: (false|true),\\n\s+timeStamp: [\\\w\s\:\-\(\)']+\\' \}'

regEx   = new RegExp("'\\{ bridge: [\\\\a-z'\\s]+,\\\\n\\s+status: (false|true),\\\\n\\s+timeStamp: [\\\\\\w\\s\\:\\-\\(\\)']+\\\\\' \\}'", "g");
