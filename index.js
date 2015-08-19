var
  snmp               = require('snmpjs'),
  bunyan             = require('bunyan'),
  wlog               = require('winston'),
  fs                 = require('fs'),
  util               = require('util'),
  postBridgeMessage  = require('./modules/post-bridge-message'),
  parseBridgeMessage = require('./modules/parse-bridge-message').parseBridgeMessage,
  handlePostResponse = require('./modules/handle-post-response'),
  getMsgOID          = require('./modules/parse-bridge-message').getMsgOID,
  oids               = require('./config/config').oids,
  port               = require('./config/config').port,
  ip                 = require('./config/config').ip,
  currentEnv         = require('./config/config').env,
  sentinel           = require('./config/config').sentinel,
  envVars            = require('./config/config').envVars
;

var
  options = {
    addr: ip,
    port: port,
    family: 'udp4'
  },
  log     = new bunyan({ name: 'snmpd', level: 'trace'})
;

if (currentEnv !== 'test') {
  wlog.add(wlog.transports.File, {
    name: 'info-file',
    filename: 'logs/info-log.log',
    timestamp: function () {
      return (new Date()).toString();
    },
    level: 'info'
  });
  wlog.add(wlog.transports.File, {
    name: 'error-file',
    filename: 'logs/error-log.log',
    timestamp: function () {
      return (new Date()).toString();
    },
    level: 'error'
  });
} else {
  wlog.info = function silenceOnTest(args) {
    return;
  };
}

var trapd = snmp.createTrapListener({ log: log });
trapd.bind(options);
wlog.info(new Date().toString() + ':  Starting up SNMP Listner \n');

trapd.on('trap',function(msg) {
  var
    msgOID    = getMsgOID(msg),
    timeStamp = (new Date()).toString()
  ;
  if (msgOID && (oids.sentinel[msgOID] != "Sentinel 16 is up")) {
    var bridgeMessage = parseBridgeMessage(msg, timeStamp);
    postBridgeMessage(bridgeMessage, null, function (err, res, status) {
      handlePostResponse(status, bridgeMessage, function (err, status) {
        if (err) wlog.error("Error posting\n" + util.inspect(bridgeMessage) + ":\n" + err + "\n Status: " + status);
      });
    });
  } else {
    wlog.info("Sentinel restart");
    var
      client = snmp.createClient({ log: log }),
      agentAddress = msg.src.address
    ;

    for (var oid in oids.bridges) {
      if (oids.bridges.hasOwnProperty(oid)) {
        client.get(agentAddress, sentinel.community, 0, oid, getSNMPCallback);
      }
    }
  }
});

function getSNMPCallback(snmpmsg) {
  var timeStamp = (new Date()).toString();
  var bridgeMessage = parseBridgeMessage(snmpmsg, timeStamp);
  postBridgeMessage(bridgeMessage, null, function (err, res, status) {
    handlePostResponse(status, bridgeMessage, function (err, status) {
      if (err) wlog.error("Error posting\n" + bridgeMessage + ":\n" + err + "\n Status: " + status + "\nAfter Sentinel Restart");
    });
  });
}
