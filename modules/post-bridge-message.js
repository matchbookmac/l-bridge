var http       = require('http');
var wlog       = require('winston');
var aBridge    = require('../config/config').aBridge;
var currentEnv = require('../config/config').env;
var request    = require('request');

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

  req.write(JSON.stringify(bridgeData));
  req.end();

  if (currentEnv !== 'test') {
    var slackUrl = "https://hooks.slack.com/services/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";
    var bridgeState = bridgeData.status ? " is starting to lift" : "has reopened";
    var slackText = bridgeData.bridge + bridgeState;
    var slackMsg = {
      channel: "#bridge-test",
      username: "l-bridge",
      text: slackText,
      icon_emoji: ":rotating_light:"
    };

    request.post(slackUrl, {
      form: {
        payload: JSON.stringify(slackMsg)
      }
    }, function (err, response) {
        if (err) return wlog.error(err);
        if (response.body !== 'ok') return wlog.error(response.body);
    });
  }
};
