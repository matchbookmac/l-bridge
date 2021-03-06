var bunyan     = require('bunyan');
var snmp       = require('snmpjs');
var mibs       = require('../config/mibs');
var currentEnv = require('../config/config').env;
var logger     = require('../config/logging');
var log;
if (currentEnv === 'test') {
  log = logger;
} else {
  log = new bunyan({ name: 'snmpd', level: 'trace'});
}

function Sentinel() {}

Sentinel.prototype.sendTrap = function sendTrap(options){
  var ip = require('ip');
  var client    = snmp.createClient({ log: log });
  var ipAddr    = options.ip || ip.address();
    // '172.20.198.7', l-bridge
  var community = options.community || 'public';
  var oid       = options.oid || '1.3.6.1.4.1.20839.1.2.1.1.1.2.6';  // Bailey's Bridge :P
    // "1.3.6.1.2.1.1.1.0", Sentinel restart
  var status    = options.status || 0;
  var callback  = function () {};

  var varbinds  = [
    snmp.varbind.createVarbind({
      // sysDescr.0
      oid: oid,
      data: snmp.data.createData({
        type: 'Integer',
        value: status
      })
    })
  ];
  // client.inform(IP address, SNMP trap community, Uptime, OID of sender, Varbinds, Callback);
  client.inform(ipAddr, community, 0, oid, varbinds, callback);
  client.close();
};

Sentinel.prototype.simulate = function simulate() {
  var agent;

  agent = snmp.createAgent({ log: log });
  agent.request(mibs);
  agent.bind({ family: 'udp4', port: 161 });
  return agent;
};

module.exports = new Sentinel();
