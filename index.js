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

// var timestamp = new Date().toLocaleTimeString();

//create new log files with timestamp
//var streamraw = fs.createWriteStream('rec-raw-'+ timestamp+'.json',{ flags: 'w',
//  encoding: "utf8",
//  mode: 0666 });
//var streamlog = fs.createWriteStream('rec-log-'+ timestamp+'.txt',{ flags: 'w',
//  encoding: "utf8",
//  mode: 0666 });

var streamraw = fs.WriteStream('rec-raw.json',{ flags: 'w',
  encoding: "utf8",
  mode: 0666 });
var streamlog = fs.WriteStream('rec-log.txt',{ flags: 'w',
  encoding: "utf8",
  mode: 0666 });

var log = new bunyan({ name: 'snmpd', level: 'trace'});
var trapd = snmp.createTrapListener({log: log});

var bridges = {
  //using oid's as keys for bridgenames
  "1.3.6.1.4.1.20839.1.2.1.1.1.2.5": "cuevas",
  "1.3.6.1.4.1.20839.1.2.1.1.1.2.4": "broadway",
  "1.3.6.1.4.1.20839.1.2.1.1.1.2.3": "burnside",
  "1.3.6.1.4.1.20839.1.2.1.1.1.2.2": "morrison",
  "1.3.6.1.4.1.20839.1.2.1.1.1.2.1": "hawthorne"
}


trapd.on('trap',function(msg) {
  var timeStamp = (new Date()).toString();
  var pkg = snmp.message.serializer(msg)

  var bridgeData = pkg.pdu.varbinds[0];

  function parseBridge(bridgeData) {
      var bridgeMessage = {
        bridge:bridges[bridgeData.oid],
        status:bridgeData.value == 1,
        timeStamp:timeStamp
      }
      postBridgeMessage(bridgeMessage, function(err, res){
        console.log(res);
      });
      streamlog.write('\n' + bridgeMessage.bridge.toString() + " status changed to " + bridgeMessage.status.toString() + " at " + bridgeMessage.timeStamp.toString())
  };
  parseBridge(bridgeData);
});

trapd.bind(options);
streamlog.write(new Date().toString() + ':  Starting up SNMP Listner \n');
streamraw.write(new Date().toString() + ':  Starting up SNMP Listner \n');
