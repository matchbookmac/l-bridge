var
  http       = require('http'),
  wlog       = require('winston'),
  aBridge    = require('../config/config').aBridge,
  currentEnv = require('../config/config').env
;

module .exports = function(bridgeData, options, callback){
  var logString;
  if (bridgeData.bridge && (typeof bridgeData.status != 'undefined') && bridgeData.timeStamp) {
    logString = bridgeData.bridge.toString() + " status changed to " + bridgeData.status.toString() + " at " + bridgeData.timeStamp.toString();
  }
  bridgeData = JSON.stringify(bridgeData);
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
      if (callback) return callback(null, response, status);
      wlog.info("Request Status: " + status, response);
      if (logString) wlog.info(logString);
    });
  });

  req.on("error", function (err) {
    if (callback) return callback(err, err.message, err.code);
  });

  req.write(bridgeData);
  req.end();
};
