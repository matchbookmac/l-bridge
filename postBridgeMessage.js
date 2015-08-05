module .exports = function(bridgeData, callback){

  var snmp = require('snmpjs');
  var http = require('http');

  bridgeData = JSON.stringify(bridgeData);

  var options = {
    hostname: "172.20.150.158",
    port: 3002,
    path: "/incoming-snmp",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": bridgeData.length
    }
  };

  var req = http.request(options, function (res) {
    console.log('STATUS: ' + res.statusCode);
    res.setEncoding('utf8');
    res.pipe(process.stdout);
  });

  req.on("error", function (err) {
    console.log("problem with request: " + err.message);
  });

  req.write(bridgeData);
  req.end();
  // END POST
}
