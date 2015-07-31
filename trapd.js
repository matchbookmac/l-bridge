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
var transmit = require('./transmit.js');

var options = {
    addr: '172.20.198.217',
    port: 4000,
    family: 'udp4',
};
var timestamp = (new Date()).toLocaleTimeString();
var daystamp = (new Date()).toString();
//create new log files everytime.  Should be the same and not in the project structure
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



trapd.on('trap',function(msg) {
var pkg = util.inspect(snmp.message.serializer(msg), false, null);
streamraw.write(pkg);
    //Ugly code follows
    //Bridge 5 Cuevas Crossing Test Bridge
    if (pkg.indexOf('1.3.6.1.4.1.20839.1.2.1.1.1.2.5') > -1 && pkg.indexOf('value: 1') >1 ){
                     console.log('Cuevas Crossing is up!');      
        bridge = 'cuevas';
        updown = 'up';
        transmit(bridge, updown, daystamp, function(err, res){
        console.log(res);
        streamlog.write(daystamp + ':  Cuevas Crossing Up '+ res+' \n');
        });
        
    }
    if (pkg.indexOf('1.3.6.1.4.1.20839.1.2.1.1.1.2.5') > -1 && pkg.indexOf('value: 0') >1 ){
                     console.log('Cuevas Crossing is down!');
        bridge = 'cuevas';
        updown = 'down';
        //send bridge and state off to transmitter
        transmit(bridge, updown, daystamp, function(err, res){
        console.log(res);
        streamlog.write(daystamp + ':  Cuevas Crossing Down'+ res+' \n');
        });
        
    }
     //Bridge 4 Broadway
    if (pkg.indexOf('1.3.6.1.4.1.20839.1.2.1.1.1.2.4') > -1 && pkg.indexOf('value: 1') >1 ){
                     console.log('Broadway Bridge is up!');
        streamlog.write(new Date().toString() + ':  Broadway Bridge Up \n');
    }
    if (pkg.indexOf('1.3.6.1.4.1.20839.1.2.1.1.1.2.4') > -1 && pkg.indexOf('value: 0') >1 ){
                     console.log('Broadway Bridge is down!');
        streamlog.write(new Date().toString() + ':  Broadway Bridge down \n');
    }
     //Bridge 3 Burnside
    if (pkg.indexOf('1.3.6.1.4.1.20839.1.2.1.1.1.2.3') > -1 && pkg.indexOf('value: 1') >1 ){
                     console.log('Burnside Bridge is up!');
        streamlog.write(new Date().toString() + ':  Burnside Bridge Up \n');
    }
    if (pkg.indexOf('1.3.6.1.4.1.20839.1.2.1.1.1.2.3') > -1 && pkg.indexOf('value: 0') >1 ){
                     console.log('Burnside Bridge is down!');
        streamlog.write(new Date().toString() + ':  Burnside Bridge down \n');
    }
     //Bridge 2 Morrison
    if (pkg.indexOf('1.3.6.1.4.1.20839.1.2.1.1.1.2.2') > -1 && pkg.indexOf('value: 1') >1 ){
                     console.log('Morrison Bridge is up!');
        streamlog.write(new Date().toString() + ':  Morrison Bridge Up \n');
    }
    if (pkg.indexOf('1.3.6.1.4.1.20839.1.2.1.1.1.2.2') > -1 && pkg.indexOf('value: 0') >1 ){
                     console.log('Morrison Bridge is down!');
        streamlog.write(new Date().toString() + ':  Morrison Bridge down \n');
    }
     //Bridge 1 Hawthorne
    if (pkg.indexOf('1.3.6.1.4.1.20839.1.2.1.1.1.2.1') > -1 && pkg.indexOf('value: 1') >1 ){
                     console.log('Hawthorne Bridge is up!');
        streamlog.write(new Date().toString() + ':  Hawthorne Bridge Up \n');
    }
    if (pkg.indexOf('1.3.6.1.4.1.20839.1.2.1.1.1.2.1') > -1 && pkg.indexOf('value: 0') >1 ){
                     console.log('Hawthorne Bridge is down!');
        streamlog.write(new Date().toString() + ':  Hawthorne Bridge down \n');
    }
});
 
trapd.bind(options);
streamlog.write(new Date().toString() + ':  Starting up SNMP Listner \n');
streamraw.write(new Date().toString() + ':  Starting up SNMP Listner \n');
