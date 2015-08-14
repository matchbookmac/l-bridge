var
  oids        = require('../config/config').oids
;

function findVarbind(snmpmsg) {
  var
    varbind,
    varbinds = snmpmsg.pdu.varbinds
  ;
  varbinds.forEach(function (varbindObject) {
    if (oids.sentinel[varbindObject.oid] || oids.bridges[varbindObject.oid]) {
      varbind = varbindObject;
    }
  });
  return varbind;
}

function getMsgOID(msg) {
  return findVarbind(msg).oid;
}

function parseBridgeMessage(snmpmsg, timeStamp) {
  var trapData = findVarbind(snmpmsg);
  return {
    bridge:oids.bridges[trapData.oid],
    status:trapData.data.value == 1,
    timeStamp:timeStamp
  };
}

module .exports = {
  findVarbind: findVarbind,
  getMsgOID: getMsgOID,
  parseBridgeMessage: parseBridgeMessage
};
