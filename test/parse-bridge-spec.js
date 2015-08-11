var
  expect      = require('chai').expect,
  parseBridge = require('../modules/parse-bridge')
;

describe('parseBridge', function () {
  before(function parsingBridge() {
    // TODO make full mock of Sentinel with snmp.createAgent
    // can make the agen and pass back an object with a variety of handlers
  // like on line 72 of /Users/macdoni/code/bridgeapp/node-snmpjs/lib/mib/mib-2/system.js
  })
  it('successfully parses trap data into a bridge message', function (done) {
    var
      timeStamp = (new Date()).toString(),
      trapData = {
        "oid":"1.3.6.1.4.1.20839.1.2.1.1.1.2.5",
        "typename":"Integer",
        "value":1,
        "string_value":"1"
      }
    ;
    var bridgeMessage = parseBridge(trapData, timeStamp);
    expect(bridgeMessage).to.have.all.keys('bridge', 'status', 'timeStamp');
    expect(bridgeMessage.status).to.equal(true);
  });
});
