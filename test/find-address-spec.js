var
  expect      = require('chai').expect,
  findAddress = require('../modules/find-address.js')
;

describe('findAddress', function () {
  it('returns the IP address of the machine the node server is running on', function () {
    expect(findAddress()).to.equal('172.20.150.158');
  });
})
