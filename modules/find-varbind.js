var oids = require('../config/oids');

module .exports = function(varbinds) {
  var varbind;
  varbinds.forEach(function (varbindObject) {
    if (oids.sentinel[varbindObject.oid] || oids.bridges[varbindObject.oid]) {
      varbind = varbindObject;
    }
  });
  return varbind;
}
