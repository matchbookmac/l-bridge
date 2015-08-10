var
  expect      = require('chai').expect,
  findVarbind = require('../modules/find-varbind')
;

describe('findVarbind', function () {
  it('returns a varbind object from a trap if its oid is known', function () {
    var varbind0 = {
      "oid":"1.3.6.1.2.1.1.3.0",
      "typename":"TimeTicks",
      "value":0,
      "string_value":"0"
      },
      varbind1 = {
        "oid":"1.3.6.1.6.3.1.1.4.1.0",
        "typename":"ObjectIdentifier",
        "value":"1.3.6.1.6.3.1.1.5.1",
        "string_value":"1.3.6.1.6.3.1.1.5.1"
      },
      varbind2 = {
        "oid":"1.3.6.1.4.1.20839.1.2.1.1.1.2.5",
        "typename":"Integer",
        "value":1,
        "string_value":"1"
      }
    ;
    var varbinds = [varbind0, varbind1, varbind2]
    expect(findVarbind(varbinds)).to.equal(varbind2);
  });
});
