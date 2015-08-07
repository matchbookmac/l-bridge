var
  os                = require('os'),
  netAddresses = os.networkInterfaces()
;
var address = "";
var addrRegEx = new RegExp('(\\d+.){4}', 'g');
for(var key in netAddresses) {
  if(key.indexOf('e') == 0) {
    netAddresses[key].forEach(function (addrObj) {
      address = addrObj.address.match(addrRegEx)
    });
  }
}
console.log(address[0]);
