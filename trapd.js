/*
    SNMP Trap Receiver

 to-do:
 add error handling to callback out to transmit
 append logs and put in spereate dir
 run under service account
 package.json

*/

var snmp = require('snmpjs');
var bunyan = require('bunyan');
var util = require('util');
var fs = require("fs");
var path = require('path');
var postBridgeMessage = require('./postBridgeMessage.js');

var options = {
    // addr: '172.20.198.217',
    addr: '172.20.144.116',
    port: 4000,
    family: 'udp4'
};
var timestamp = new Date().toLocaleTimeString();

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
var bridge = '';
var updown ='';

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
  // var pkg = util.inspect(snmp.message.serializer(msg), false, null);
  var pkg = snmp.message.serializer(msg)
  // streamraw.write(pkg);

  var bridgeData = pkg.pdu.varbinds[0];
    console.log(pkg.pdu);

  function parseBridge(bridgeData) {
      var bridgeMessage = {
        bridge:bridges[bridgeData.oid],
        status:bridgeData.value,
        timeStamp:timeStamp
      }
      console.log(bridgeMessage)




      postBridgeMessage(bridgeMessage, function(err, res){
          console.log(res);
      });
  };
  parseBridge(bridgeData);
});

trapd.bind(options);
streamlog.write(new Date().toString() + ':  Starting up SNMP Listner \n');
streamraw.write(new Date().toString() + ':  Starting up SNMP Listner \n');
