var snmp = require('snmpjs');

module .exports = function(options){
  var ip = require('ip');
  var
    client    = snmp.createClient({}),
    ip        = options.ip || ip.address(),
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
  client.inform(ip, community, 0, oid, varbinds, callback);
  client.close();
}
