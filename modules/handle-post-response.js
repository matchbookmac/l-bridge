var
  http               = require('http'),
  wlog               = require('winston'),
  util               = require('util'),
  retry              = require('retry'),
  snmp               = require('snmpjs'),
  postBridgeMessage  = require('./post-bridge-message'),
  parseBridgeMessage = require('./parse-bridge-message').parseBridgeMessage,
  aBridge            = require('../config/config').aBridge,
  bridges            = require('../config/config').bridges,
  sentinel           = require('../config/config').sentinel,
  currentEnv         = require('../config/config').env
;

if (currentEnv === 'test') {
  process.stderr.write = wlog.info = function silenceOnTest(args) {
    return;
  };
}

function twoHundred(bridgeData, callback){
  callback(null, 200);
}

function fourHundred(bridgeData, callback){
  if (typeof bridgeData.bridge === 'undefined') {
    wlog.info('400 error, bridge name not set for' + bridgeData);
  }
  if (typeof bridgeData.status === 'undefined') {
    wlog.info('400 error, bridge status not set for' + bridgeData);
  }
  if (typeof bridgeData.timeStamp === 'undefined') {
    wlog.info('400 error, bridge timestamp not set for' + bridgeData);
  }
  var
    client = snmp.createClient(),
    snmpResponse
  ;

  if (bridgeData.bridge) {
    client.get(sentinel.ip, sentinel.community, 0, bridges[bridgeData.bridge], function (snmpmsg) {
      getSNMPCallback(snmpmsg, callback);
    });
  } else {
    // TODO I think that if the bridge is unkown, we just have the system
    // cry for help instead of trying to figure it out.

    // OR do one of two things. A. get all statuses from sentinel. If none
    // are up, then get statuses from a-bridge, and asume that it is a down
    // signal for whatever is up.

    // for (var oid in oids.bridges) {
    //   if (oids.bridges.hasOwnProperty(oid)) {
    //     client.get(agentAddress, sentinel.community, 0, oid, function (snmpmsg) {
    //       snmpResponse = getSNMPCallback(snmpmsg);
    //     });
    //   }
    // }
  }
}

function fourZeroFour(bridgeData, callback){
  postBridgeMessage(bridgeData, aBridge, function (err, res, status) {
    postRequestRetryCallback(err ,res, status, bridgeData, callback);
  });
}

function fiveHundred(bridgeData, callback){
  var operation = retry.operation({ retries: 5 });

  operation.attempt(function () {
    postBridgeMessage(bridgeData, aBridge, function (err, res, status) {
      if (status === 200) {
        wlog.info('Retry for:\n' + util.inspect(bridgeData) + '\nsuccessful');
        return callback(null, status);
      } else if (postResponses[status.toString()] && status != 500) {
        handlePostResponse(status, bridgeData, callback);
      } else {
        if (operation.retry({ err: err, response: res })) {
          return;
        }
        callback(operation.mainError(), status);
      }
    });
  });
}

function getSNMPCallback(snmpmsg, callback) {
  var
    timeStamp = (new Date()).toString(),
    retryStatus
  ;
  var bridgeMessage = parseBridgeMessage(snmpmsg, timeStamp);
  postBridgeMessage(bridgeMessage, null, function (err, res, status) {
    postRequestRetryCallback(err, res, status, bridgeMessage, callback);
  });
}

function postRequestRetryCallback(err, res, status, message, callback) {
  if (status === 200) {
    wlog.info('Retry for:\n' + util.inspect(message) + '\nsuccessful');
    return callback(null, status);
  } else if (postResponses[status.toString()]) {
    wlog.info('Retry for:\n' + util.inspect(message) + '\nunsucessful with HTTP error: ' + status);
    return callback(err, status);
  }
}

function handlePostResponse(status, bridgeMessage, callback) {
  postStatus = status.toString();
  var that = this;
  postResponses[postStatus].call(that, bridgeMessage, callback);
}

var postResponses = {
  "200": twoHundred,
  "400": fourHundred,
  "404": fourZeroFour,
  "500": fiveHundred
};

module .exports = handlePostResponse;
