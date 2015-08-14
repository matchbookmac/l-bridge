var
  http       = require('http'),
  wlog       = require('winston'),
  ip         = require('ip'),
  currentEnv = require('../config/config').env
;

if (currentEnv === 'test') {
  process.stderr.write = wlog.info = function silenceOnTest(args) {
    return;
  };
}

module .exports = function(bridgeData, options, callback){
  bridgeData = JSON.stringify(bridgeData);
  var successLogString;
  if (bridgeData.bridge && bridgeData.status && bridgeData.timeStamp) {
    successLogString = bridgeData.bridge.toString() + " status changed to " + bridgeData.status.toString() + " at " + bridgeData.timeStamp.toString();
  }
  var
    headers = {
      "Content-Type": "application/json",
      "Content-Length": bridgeData.length
    },
    response = ''
  ;
  if (!options) options = {};
  options.hostname = options.hostname || "52.26.186.75";
  options.port     = options.port     || 80;
  options.path     = options.path     || "/incoming-snmp";
  options.method   = options.method   || "POST";
  options.headers  = options.headers  || headers;

  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    var status = res.statusCode;

    res.on('data', function (chunk) {
      response += chunk;
    });

    res.on('end', function () {
      if (callback) callback(response, status);
      wlog.info("Request Status: " + status, response);
      wlog.info(successLogString);
    });
  });

  req.on("error", function (err) {
    if (callback) callback(err.message, null);
  });

  req.write(bridgeData);
  req.end();
};
