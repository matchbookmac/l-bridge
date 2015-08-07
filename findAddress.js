module .exports = function(){
  var os = require('os');

  var
    address      = "",
    addrRegEx    = new RegExp('(\\d+.){4}', 'g'),
    netAddresses = os.networkInterfaces()
  ;

  for(var key in netAddresses) {
    if(key.indexOf('e') == 0) {
      netAddresses[key].forEach(function (addrObj) {
        address = addrObj.address.match(addrRegEx)
      });
    }
  }
  return address[0];
}
