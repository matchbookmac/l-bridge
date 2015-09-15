var https      = require('https');
var wlog       = require('winston');
var aBridge    = require('../config/config').aBridge;
var currentEnv = require('../config/config').env;

module .exports = function(bridgeData, options, callback){
  var logString;
  if (bridgeData.bridge && (typeof bridgeData.status != 'undefined') && bridgeData.timeStamp) {
    logString = bridgeData.bridge.toString() + " status changed to " + bridgeData.status.toString() + " at " + bridgeData.timeStamp.toString();
  }
  var response = '';

  if (!options) options = {};
  options.hostname = options.hostname || aBridge.hostname;
  options.port     = options.port     || aBridge.port;
  options.path     = options.path     || aBridge.path ;
  options.method   = options.method   || aBridge.method;
  options.headers  = options.headers  || aBridge.headers;
  options.headers["Content-Length"] = JSON.stringify(bridgeData).length;

  var req = https.request(options, function (res) {
    res.setEncoding('utf8');
    var status = res.statusCode;

    res.on('data', function (chunk) {
      response += chunk;
    });

    res.on('end', function () {
      wlog.info("[%s] outgoing post %s - %s",
        require("lodash").keys(res.req.agent.sockets)[0].split(":")[0],
        req.path,
        status
      );
      if (callback) return callback(null, response, status);
      wlog.info("Request Status: " + status, response);
      if (logString) wlog.info(logString);
    });
  });

  req.on("error", function (err) {
    if (callback) return callback(err, err.message, err.code);
  });

  req.write(JSON.stringify(bridgeData));
  req.end();
};
