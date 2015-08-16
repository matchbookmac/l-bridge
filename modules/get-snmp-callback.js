var
  parseBridgeMessage = require('./parse-bridge-message'),
  postBridgeMessage  = require('./post-bridge-message')
;

module .exports = function getSNMPCallback(snmpmsg) {
  var timeStamp = (new Date()).toString();
  var bridgeMessage = parseBridgeMessage(snmpmsg, timeStamp);
  postBridgeMessage(bridgeMessage);
};
