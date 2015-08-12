var
  oids        = require('../config/oids'),
  findVarbind = require('./find-varbind')
;

function getMsgOID(msg) {
  return findVarbind(msg.pdu.varbinds).oid;
}

function parseBridgeMessage(snmpmsg, timeStamp) {
  var trapData = findVarbind(snmpmsg.pdu.varbinds)
  return {
    bridge:oids.bridges[trapData.oid],
    status:trapData.data.value == 1,
    timeStamp:timeStamp
  }
}

module .exports = {
  getMsgOID: getMsgOID,
  parseBridgeMessage: parseBridgeMessage
}
