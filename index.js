var
  snmp               = require('snmpjs'),
  bunyan             = require('bunyan'),
  wlog               = require('winston'),
  fs                 = require("fs"),
  ip                 = require('ip'),
  oids               = require('./config/oids'),
  postBridgeMessage  = require('./modules/post-bridge-message'),
  parseBridgeMessage = require('./modules/parse-bridge-message').parseBridgeMessage,
  getMsgOID          = require('./modules/parse-bridge-message').getMsgOID,
  port               = parseInt(process.argv[2])
;

module .exports = (function() {
  var
    options = {
      addr: ip.address(),
      port: port || 162,
      family: 'udp4'
    },
    log     = new bunyan({ name: 'snmpd', level: 'trace'})
  ;

  wlog.add(wlog.transports.File, {
    filename: 'logs/winstonlog.log',
    timestamp: function () {
      return (new Date()).toString();
    }
  });

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
      postBridgeMessage(bridgeMessage);
    } else {
      wlog.info("Sentinel restart");
      var
        client = snmp.createClient({ log: log }),
        agentAddress = msg.src.address,
        // "172.20.15.236",
        community = "bridgestat"
      ;

      for (var oid in oids.bridges) {
        if (oids.bridges.hasOwnProperty(oid)) {
          client.get(agentAddress, community, 0, oid, getSNMPCallback);
        }
      }
    }
  });
})();

function getSNMPCallback(snmpmsg) {
  var timeStamp = (new Date()).toString();
  var bridgeMessage = parseBridgeMessage(snmpmsg, timeStamp);
  postBridgeMessage(bridgeMessage);
}
