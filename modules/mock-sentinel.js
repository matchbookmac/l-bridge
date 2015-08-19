var
  bunyan     = require('bunyan'),
  snmp       = require('snmpjs'),
  mibs       = require('../config/mibs'),
  currentEnv = require('../config/config').env,
  log
;

if (currentEnv === 'test') {
  log = require('./test-logger');
} else {
  log = new bunyan({ name: 'snmpd', level: 'trace'});
}

function Sentinel() {}

Sentinel.prototype.sendTrap = function sendTrap(options){
  var ip = require('ip');
  var
    client    = snmp.createClient({ log: log }),
    ipAddr    = options.ip || ip.address(),
    // '172.20.198.7', l-bridge
    community = options.community || 'public',
    oid       = options.oid || '1.3.6.1.4.1.20839.1.2.1.1.1.2.6',  // Bailey's Bridge :P
    // "1.3.6.1.2.1.1.1.0", Sentinel restart
    status    = options.status || 0,
    callback  = function () {}
  ;

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
