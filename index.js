require('./config/logging');
var snmp               = require('snmpjs');
var bunyan             = require('bunyan');
var logger             = require('./config/logging');
var fs                 = require('fs');
var util               = require('util');
var postBridgeMessage  = require('./modules/post-bridge-message');
var parseBridgeMessage = require('./modules/parse-bridge-message').parseBridgeMessage;
var handlePostResponse = require('./modules/handle-post-response');
var getMsgOID          = require('./modules/parse-bridge-message').getMsgOID;
var serverConfig       = require('./config/config');

var options = {
  addr: serverConfig.ip,
  port: serverConfig.port,
  family: 'udp4'
};
// var log = logger;
var log = new bunyan({ name: 'snmpd', level: 'trace'});

var trapd = snmp.createTrapListener({ log: log });
trapd.bind(options);
logger.info(new Date().toString() + ':  Starting up SNMP Listner');

trapd.on('trap',function(msg) {
  var msgOID    = getMsgOID(msg);
  var timeStamp = (new Date()).toString();

  if (msgOID && (serverConfig.oids.sentinel[msgOID] != "Sentinel 16 is up")) {
    var bridgeMessage = parseBridgeMessage(msg, timeStamp);
    postBridgeMessage(bridgeMessage, null, function (err, res, status) {
      handlePostResponse(status, bridgeMessage, function (err, status) {
        if (err) logger.error("Error posting\n" + util.inspect(bridgeMessage) + ":\n" + err + "\n Status: " + status);
      });
    });
    require('./modules/post-to-slack')(bridgeMessage);
  } else {
    logger.warn("Sentinel restart");
    var client = snmp.createClient({ log: log });
    var agentAddress = msg.src.address;

    for (var oid in serverConfig.oids.bridges) {
      if (serverConfig.oids.bridges.hasOwnProperty(oid)) {
        client.get(agentAddress, serverConfig.sentinel.community, 0, oid, getSNMPCallback);
      }
    }
  }
});

function getSNMPCallback(snmpmsg) {
  var timeStamp = (new Date()).toString();
  var bridgeMessage = parseBridgeMessage(snmpmsg, timeStamp);
  postBridgeMessage(bridgeMessage, null, function (err, res, status) {
    handlePostResponse(status, bridgeMessage, function (err, status) {
      if (err) logger.error("Error posting\n" + bridgeMessage + ":\n" + util.inspect(err) + "\n Status: " + status + "\nAfter Sentinel Restart");
    });
  });
}
