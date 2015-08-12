var
  expect             = require('chai').expect,
  snmp               = require('snmpjs'),
  ip                 = require('ip'),
  sentinel           = require('../modules/mock-sentinel'),
  parseBridgeMessage = require('../modules/parse-bridge-message').parseBridgeMessage,
  getMsgOID          = require('../modules/parse-bridge-message').getMsgOID
;

var snmpMessage;
var timeStamp;
before(function parsingBridge(done) {
  sentinel.simulate();
  var client = snmp.createClient();
  client.get(ip.address(), 'any', 0, '1.3.6.1.4.1.20839.1.2.1.1.1.2.5', function (snmpmsg) {
    timeStamp = (new Date()).toString();
    snmpMessage = snmpmsg;
    done();
  });
});

describe('parseBridgeMessage', function () {
  it('successfully parses trap data into a bridge message', function () {
    var bridgeMessage = parseBridgeMessage(snmpMessage, timeStamp);
    expect(bridgeMessage).to.have.all.keys('bridge', 'status', 'timeStamp');
    expect(bridgeMessage.status).to.equal(true);
  });
});

describe('getMsgOID', function () {
  it('finds the OID of an snmp trap message', function () {
    expect(getMsgOID(snmpMessage)).to.equal('1.3.6.1.4.1.20839.1.2.1.1.1.2.5');
  });
});
