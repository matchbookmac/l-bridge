var
  expect             = require('chai').expect,
  snmp               = require('snmpjs'),
  ip                 = require('ip'),
  sentinel           = require('../modules/mock-sentinel'),
  getMsgOID          = require('../modules/parse-bridge-message').getMsgOID,
  findVarbind          = require('../modules/parse-bridge-message').findVarbind,
  parseBridgeMessage = require('../modules/parse-bridge-message').parseBridgeMessage
;

describe('parsing an snmp message', function () {
  var snmpMessage, timeStamp, mockSentinel, client;

  before(function parsingBridgeTests(done) {
    mockSentinel = sentinel.simulate();
    client = snmp.createClient();
    client.get(ip.address(), 'any', 0, '1.3.6.1.4.1.20839.1.2.1.1.1.2.5', function (snmpmsg) {
      timeStamp = (new Date()).toString();
      snmpMessage = snmpmsg;
      done();
    });
  });

  describe('findVarbind', function () {
    it('returns a varbind object from a trap if its oid is known', function () {
      expect(findVarbind(snmpMessage).data.value).to.equal(1);
      expect(findVarbind(snmpMessage).oid).to.equal("1.3.6.1.4.1.20839.1.2.1.1.1.2.5");
    });
  });

  describe('getMsgOID', function () {
    it('finds the OID of an snmp trap message', function () {
      expect(getMsgOID(snmpMessage)).to.equal('1.3.6.1.4.1.20839.1.2.1.1.1.2.5');
    });
  });

  describe('parseBridgeMessage', function () {
    it('successfully parses trap data into a bridge message', function () {
      var bridgeMessage = parseBridgeMessage(snmpMessage, timeStamp);
      expect(bridgeMessage).to.have.all.keys('bridge', 'status', 'timeStamp');
      expect(bridgeMessage.status).to.equal(true);
    });
  });

  after(function parsingBridgeTestsDone(done) {
    client.close();
    mockSentinel.close();
    done();
  });
});
