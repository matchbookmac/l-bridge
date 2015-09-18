var http               = require('http');
var logger             = require('../config/logging');
var util               = require('util');
var retry              = require('retry');
var snmp               = require('snmpjs');
var postBridgeMessage  = require('./post-bridge-message');
var parseBridgeMessage = require('./parse-bridge-message').parseBridgeMessage;
var aBridge            = require('../config/config').aBridge;
var bridges            = require('../config/config').bridges;
var sentinel           = require('../config/config').sentinel;
var currentEnv         = require('../config/config').env;

function twoHundred(bridgeData, callback){
  callback(null, 200);
}

function fourHundred(bridgeData, callback){
  if (typeof bridgeData.bridge === 'undefined') {
    logger.error('400 error, bridge name not set for' + bridgeData);
  }
  if (typeof bridgeData.status === 'undefined') {
    logger.error('400 error, bridge status not set for' + bridgeData);
  }
  if (typeof bridgeData.timeStamp === 'undefined') {
    logger.error('400 error, bridge timestamp not set for' + bridgeData);
  }
  var client = snmp.createClient();
  var snmpResponse;

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

function exponentialRetry(bridgeData, callback) {
  var operation = retry.operation({ retries: 4 });

  operation.attempt(function () {
    postBridgeMessage(bridgeData, aBridge, function (err, res, status) {
      switch (status) {
        case 200:
          logger.info('Retry for:\n' + util.inspect(bridgeData) + '\nsuccessful');
          return callback(null, status);
        case 500: case 503: case 504: case "ECONNREFUSED":
          if (operation.retry({ err: err, response: res })) {
            return;
          }
          callback(operation.mainError(), status);
          break;
        default:
          handlePostResponse(status, bridgeData, callback);
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
    logger.info('Retry for:\n' + util.inspect(message) + '\nsuccessful');
    return callback(null, status);
  } else if (postResponses[status.toString()]) {
    logger.error('Retry for:\n' + util.inspect(message) + '\nunsucessful with HTTP error: ' + status);
    return callback(err, status);
  }
}

function handlePostResponse(status, bridgeMessage, callback) {
  postStatus = status.toString();
  var that = this;
  if (postResponses[postStatus]) {
    postResponses[postStatus].call(that, bridgeMessage, callback);
  } else {
    logger.error('Unknown Response Status: ' + status + ', Unsure how to handle');
  }
}

var postResponses = {
  "200": twoHundred,
  "400": fourHundred,
  "404": fourZeroFour,
  "500": exponentialRetry,
  "503": exponentialRetry,
  "504": exponentialRetry,
  "ECONNREFUSED": exponentialRetry
};

module.exports = handlePostResponse;
