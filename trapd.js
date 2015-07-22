/*
    SNMP Trap Receiver
 
*/
 
var snmp = require('snmpjs');
var bunyan = require('bunyan');
var util = require('util');
var msgout = '' 
var options = {
    addr: '172.20.198.7',
    port: 162,
    family: 'udp4',
};
 
var log = new bunyan({ name: 'snmpd', level: 'trace'});
 
var trapd = snmp.createTrapListener({log: log});
 
trapd.on('trap',function(msg) {
    console.log(util.inspect(snmp.message.serializer(msg), false, null));

});
 
trapd.bind(options);