module.exports = function(bridgeData, callback){
var dgram = require('dgram');
var http = require('http');

var client =dgram.createSocket('udp4');
//ip should be message receiving machine
// var ip = '172.20.150.21';
var ip = '172.20.144.116';
var brg = bridge+' '+updown+' @ '+daystamp;
var message = new Buffer(brg);

client.bind();
client.send(message, 0, message.length, 4040, ip);
//console.log('Message Sent');

 var res = 'Message Sent to a-bridge';

 callback(null, res);
};
