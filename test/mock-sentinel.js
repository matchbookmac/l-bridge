module .exports = function(status){
  var
    snmp = require('snmpjs'),
    path = require("path")
  ;
  var
    ipAddress = require('../modules/find-address.js')()
  ;

  var
    client    = snmp.createClient({}),
    ip        = ipAddress,
    community = 'public',
    oid       = '1.3.6.1.4.1.20839.1.2.1.1.1.2.6',  // Bailey's Bridge :P
    varbinds  = [
  		snmp.varbind.createVarbind({
  			// sysDescr.0
  			oid: '1.3.6.1.4.1.20839.1.2.1.1.1.2.6',
  			data: snmp.data.createData({
  				type: 'Integer',
  				value: status
  			})
  		})
    ],
    callback  = function (msg) {
      console.log(msg);
    }
  ;

  // client.inform(IP address, SNMP trap community, Uptime, OID of sender, Varbinds, Callback);
  client.inform(ip, community, 0, oid, varbinds, callback);
}
