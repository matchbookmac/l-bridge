var
  oids = require('../config/oids')
;

module .exports = function(trapData, timeStamp) {
  return {
    bridge:oids.bridges[trapData.oid],
    status:trapData.data.value == 1,
    timeStamp:timeStamp
  }
}
