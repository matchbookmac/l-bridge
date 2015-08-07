var
  snmp              = require('snmpjs'),
  bunyan            = require('bunyan'),
  wlog              = require('winston'),
  fs                = require("fs"),
  path              = require('path'),
  os                = require('os'),
  ipAddress         = require('./findAddress.js')(),
  postBridgeMessage = require('./postBridgeMessage.js')
;

var
  netAddresses = os.networkInterfaces(),
  options      = {
    // netAddresses gets local ip address
    addr: ipAddress,
    port: 4000,
    family: 'udp4'
  }
;

var streamraw = fs.WriteStream('rec-raw.json',{ flags: 'w',
  encoding: "utf8",
  mode: 0666 });
var streamlog = fs.WriteStream('rec-log.txt',{ flags: 'w',
  encoding: "utf8",
  mode: 0666 });

// var log = new bunyan({ name: 'snmpd', level: 'trace'});
wlog.add(wlog.transports.File, { filename: 'logs/winstonlog.log'});
var trapd = snmp.createTrapListener();

var oids = {
  //using oid's as keys for bridgenames
  "1.3.6.1.2.1.1.1.0":               "Sentinel 16 is up",
  bridges: {
    "1.3.6.1.4.1.20839.1.2.1.1.1.2.5": "cuevas",
    "1.3.6.1.4.1.20839.1.2.1.1.1.2.4": "broadway",
    "1.3.6.1.4.1.20839.1.2.1.1.1.2.3": "burnside",
    "1.3.6.1.4.1.20839.1.2.1.1.1.2.2": "morrison",
    "1.3.6.1.4.1.20839.1.2.1.1.1.2.1": "hawthorne"
  }
}


trapd.on('trap',function(msg) {
  var
    timeStamp = (new Date()).toString(),
    trapData = msg.pdu.varbinds[0],
    agentAddress = msg.pdu.agent_addr,
    community = "bridgestat"
  ;

  function parseBridge(trapData) {
    if (oids[trapData.oid] != "Sentinel 16 is up") {
      var bridgeMessage = {
        bridge:oids[trapData.oid],
        status:trapData.data.value == 1,
        timeStamp:timeStamp
      }
      postBridgeMessage(bridgeMessage, function(err, res){
        wlog.info(res.status.toString());
      });
      streamlog.write('\n' + bridgeMessage.bridge.toString() + " status changed to " + bridgeMessage.status.toString() + " at " + bridgeMessage.timeStamp.toString());
      wlog.info(bridgeMessage.bridge.toString() + " status changed to " + bridgeMessage.status.toString() + " at " + bridgeMessage.timeStamp.toString());
    } else {
      console.log("Sentinel has started up");
      wlog.info("Sentinel restart")
      var client = snmp.createClient({ log: log });
      for (var oid in oids.bridges) {
        if (oids.hasOwnProperty(oid)) {
          client.get(agentAddress, community, 0, oid, function (snmpmsg) {
            var timeStamp = (new Date()).toString();
            var bridgeMessage = {
              bridge:oids[snmpmsg.pdu.varbinds[0].oid],
              status:snmpmsg.pdu.varbinds[0].data.value == 1,
              timeStamp:timeStamp
            }
            postBridgeMessage(bridgeMessage, function(err, res){
              wlog.info(res.status.toString());
            });
          });
        }
      }
    }
  };
  parseBridge(trapData);
});

trapd.bind(options);
streamlog.write(new Date().toString() + ':  Starting up SNMP Listner \n');
streamraw.write(new Date().toString() + ':  Starting up SNMP Listner \n');
