var
  http       = require('http'),
  wlog       = require('winston'),
  ip         = require('ip'),
  aBridge    = require('../config/config').aBridge,
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
  var response = '';

  if (!options) options = {};
  options.hostname = options.hostname || aBridge.hostname;
  options.port     = options.port     || aBridge.port;
  options.path     = options.path     || aBridge.path ;
  options.method   = options.method   || aBridge.method;
  options.headers  = options.headers  || aBridge.headers;
  options.headers["Content-Length"] = bridgeData.length;

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
