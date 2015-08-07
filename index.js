var
  snmp              = require('snmpjs'),
  bunyan            = require('bunyan'),
  fs                = require("fs"),
  path              = require('path'),
  postBridgeMessage = require('./postBridgeMessage.js'),
  ipAddress         = require('./findAddress.js')()
;

var options = {
    addr: ipAddress,
    port: 4000,
    family: 'udp4'
  }
;

function print_get_response(snmpmsg)
{
	snmpmsg.pdu.varbinds.forEach(function (varbind) {
		console.log(varbind.oid + ' = ' + varbind.data.value);
	});
}


var streamraw = fs.WriteStream('rec-raw.json',{ flags: 'w',
  encoding: "utf8",
  mode: 0666 });
var streamlog = fs.WriteStream('rec-log.txt',{ flags: 'w',
  encoding: "utf8",
  mode: 0666 });

var log = new bunyan({ name: 'snmpd', level: 'trace'});
var trapd = snmp.createTrapListener({log: log});

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
        console.log(res);
      });
      streamlog.write('\n' + bridgeMessage.bridge.toString() + " status changed to " + bridgeMessage.status.toString() + " at " + bridgeMessage.timeStamp.toString());
    } else {
      console.log("Sentiel has started up");
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
              console.log(res);
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
