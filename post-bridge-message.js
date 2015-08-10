module .exports = function(bridgeData, callback){

  var
    snmp = require('snmpjs'),
    http = require('http'),
    wlog = require('winston'),
    os   = require('os')
  ;

  bridgeData = JSON.stringify(bridgeData);

  var
    netAddresses = os.networkInterfaces(),
    options = {

      // hostname: netAddresses.en0[1].address,
      hostname: "52.26.186.75",
      port: 80,
      path: "/incoming-snmp",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": bridgeData.length
      }
    }
  ;

  var req = http.request(options, function (res) {
    wlog.info('STATUS: ' + res.statusCode);
    res.setEncoding('utf8');
    res.pipe(process.stdout);
  });

  req.on("error", function (err) {
    wlog.info("problem with request: " + err.message);
  });

  req.write(bridgeData);
  req.end();
  // END POST
}
