var
  snmp              = require('snmpjs'),
  bunyan            = require('bunyan'),
  wlog              = require('winston'),
  fs                = require("fs"),
  path              = require('path'),
  os                = require('os'),
  ip                = require('ip'),
  oids              = require('./config/oids'),
  findVarbind       = require('./modules/find-varbind')
  postBridgeMessage = require('./modules/post-bridge-message'),
  saveBridgeMessage = require('./modules/save-bridge-message'),
  port              = parseInt(process.argv[2])
;

module .exports = (function() {
  var
    options   = {
      addr: ip.address(),
      port: port || 162,
      family: 'udp4'
    },
    streamraw = fs.WriteStream('rec-raw.json',{
      flags: 'w',
      encoding: "utf8",
      mode: 0666 }),
    streamlog = fs.WriteStream('rec-log.txt',{
      flags: 'w',
      encoding: "utf8",
      mode: 0666 }),
    log       = new bunyan({ name: 'snmpd', level: 'trace'})
  ;

  wlog.add(wlog.transports.File, { filename: 'logs/winstonlog.log'});

  var trapd = snmp.createTrapListener({ log: log });
  trapd.bind(options);
  streamlog.write(new Date().toString() + ':  Starting up SNMP Listner \n');
  streamraw.write(new Date().toString() + ':  Starting up SNMP Listner \n');

  trapd.on('trap',function(msg) {
    var
      timeStamp = (new Date()).toString(),
      trapData = findVarbind(msg.pdu.varbinds),
      agentAddress = "172.20.15.236",
      // msg.src.address,
      community = "bridgestat"
    ;

    function parseBridge(trapData) {
      if (oids.sentinel[trapData.oid] != "Sentinel 16 is up") {
        var bridgeMessage = {
          bridge:oids.bridges[trapData.oid],
          status:trapData.data.value == 1,
          timeStamp:timeStamp
        }
        postBridgeMessage(bridgeMessage, function(err, res){
          wlog.info(res.status.toString());
        });
        saveBridgeMessage(bridgeMessage);
        streamlog.write('\n' + bridgeMessage.bridge.toString() + " status changed to " + bridgeMessage.status.toString() + " at " + bridgeMessage.timeStamp.toString());
        wlog.info(bridgeMessage.bridge.toString() + " status changed to " + bridgeMessage.status.toString() + " at " + bridgeMessage.timeStamp.toString());
      } else {
        wlog.info("Sentinel restart")
        var client = snmp.createClient({ log: log });
        for (var oid in oids.bridges) {
          if (oids.bridges.hasOwnProperty(oid)) {
            client.get(agentAddress, community, 0, oid, function (snmpmsg) {
              var timeStamp = (new Date()).toString();
              var bridgeMessage = {
                bridge:oids.bridges[snmpmsg.pdu.varbinds[0].oid],
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

    if (trapData) {
      parseBridge(trapData);
    }

  });
})();
