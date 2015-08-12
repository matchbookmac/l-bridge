var
  snmp               = require('snmpjs'),
  bunyan             = require('bunyan'),
  wlog               = require('winston'),
  fs                 = require("fs"),
  ip                 = require('ip'),
  oids               = require('./config/oids'),
  findVarbind        = require('./modules/find-varbind')
  postBridgeMessage  = require('./modules/post-bridge-message'),
  parseBridgeMessage = require('./modules/parse-bridge-message').parseBridgeMessage,
  getMsgOID          = require('./modules/parse-bridge-message').getMsgOID,
  saveBridgeMessage  = require('./modules/save-bridge-message'),
  port               = parseInt(process.argv[2])
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
      msgOID    = getMsgOID(msg),
      timeStamp = (new Date()).toString()
    ;

    if (msgOID && (oids.sentinel[msgOID] != "Sentinel 16 is up")) {
      var bridgeMessage = parseBridgeMessage(msg, timeStamp);

      var successLogString = bridgeMessage.bridge.toString() + " status changed to " + bridgeMessage.status.toString() + " at " + bridgeMessage.timeStamp.toString();

      postBridgeMessage(bridgeMessage, function(res, status){
        wlog.info("Request Status: " + status, res);
        wlog.info(successLogString);
        saveBridgeMessage(bridgeMessage);
      });
    } else {
      wlog.info("Sentinel restart")
      var
        client = snmp.createClient({ log: log }),
        agentAddress = msg.src.address,
        // "172.20.15.236",
        community = "bridgestat"
      ;
      for (var oid in oids.bridges) {
        if (oids.bridges.hasOwnProperty(oid)) {
          client.get(agentAddress, community, 0, oid, function (snmpmsg) {
            var timeStamp = (new Date()).toString();

            var bridgeMessage = parseBridgeMessage(snmpmsg, timeStamp);

            var successLogString = bridgeMessage.bridge.toString() + " status changed to " + bridgeMessage.status.toString() + " at " + bridgeMessage.timeStamp.toString();

            postBridgeMessage(bridgeMessage, function(res, status){
              wlog.info("Request Status: " + status, res);
              wlog.info(successLogString);
              saveBridgeMessage(bridgeMessage);
            });
          });
        }
      }
    }
  });
})();
