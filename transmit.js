module.exports = function(bridge, updown, daystamp, callback){
var dgram = require('dgram');
var client =dgram.createSocket('udp4');
//ip should be message receiving machine
var ip = '172.20.150.21';
var brg = bridge+'  '+updown+' @ '+daystamp;
var message = new Buffer('SOM'+brg);  
    
client.bind();
client.send(message, 0, message.length, 4040, ip);
//console.log('Message Sent');
 
 var res = 'Message Sent to A-bridge'; 
                 
 callback(null, res);
};
   
    
 

