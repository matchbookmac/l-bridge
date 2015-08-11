var
  oids = require('../config/oids'),
  saveBridgeMessage = require('./save-bridge-message'),
  wlog     = require('winston')
;

module .exports = function(trapData, timeStamp) {
  var bridgeMessage = {
    bridge:oids.bridges[trapData.oid],
    status:trapData.data.value == 1,
    timeStamp:timeStamp
  }
  var successLogString = bridgeMessage.bridge.toString() + " status changed to " + bridgeMessage.status.toString() + " at " + bridgeMessage.timeStamp.toString();

  postBridgeMessage(bridgeMessage, function(res, status){
    wlog.info("Request Status: " + status, res);
    wlog.info(successLogString);
    saveBridgeMessage(bridgeMessage);
  });
}
