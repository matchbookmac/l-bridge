var
  http       = require('http'),
  wlog       = require('winston'),
  aBridge    = require('../config/config').aBridge,
  oids       = require('../config/config').oids,
  aBridge    = require('../config/config').sentinel,
  currentEnv = require('../config/config').env
;

if (currentEnv === 'test') {
  process.stderr.write = wlog.info = function silenceOnTest(args) {
    return;
  };
}

function twoHundred(bridgeData, callback){
  callback();
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
    client = snmp.createClient({ log: log }),
    snmpResponse
  ;

  if (bridgeData.bridge) {
    client.get(sentinel.ip, sentinel.community, 0, oids.bridges[bridgeData.bridge], snmpResponse = getSNMPCallback);
  } else {
    for (var oid in oids.bridges) {
      if (oids.bridges.hasOwnProperty(oid)) {
        client.get(agentAddress, sentinel.community, 0, oid, snmpResponse = getSNMPCallback);
      }
    }
  }
  callback(status);
}

function fourZeroFour(bridgeData, callback){
  callback();
}

function fiveHundred(bridgeData, callback){
  callback();
}

var postResponses = {
  "200": twoHundred,
  "400": fourHundred,
  "404": fourZeroFour,
  "500": fiveHundred
};

function getSNMPCallback(snmpmsg) {
  var
    timeStamp = (new Date()).toString(),
    retryStatus
  ;
  var bridgeMessage = parseBridgeMessage(snmpmsg, timeStamp);
  postBridgeMessage(bridgeMessage, null, function (res, status) {
    if (handlePostResponse[status]) {
      wlog.info('Retry for' + bridgeMessage + 'unsucessful with HTTP error: ' + status);
    } else if (status === 200) {
      wlog.info('Retry for' + bridgeMessage + 'successful');
    }
    retryStatus = status;
  });
  // TODO You were here bottom of callback stack
  return {
    retryStatus: retryStatus,
    message: bridgeMessage
  };
}

module .exports = function handlePostResponse(status, bridgeMessage, callback) {
  postStatus = status.toString();
  var that = this;
  postResponses[postStatus].call(that, bridgeMessage, callback);
};
