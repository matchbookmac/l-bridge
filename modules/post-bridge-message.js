var
  http     = require('http'),
  wlog     = require('winston'),
  ip       = require('ip')
;

module .exports = function(bridgeData, callback){
  var
    response = '',
    error    = ''
  ;

  bridgeData = JSON.stringify(bridgeData);

  var
    options = {
      hostname: "52.26.186.75",
      port: 80,
      path: "/incoming-snmp",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": bridgeData.length
      }
    }
  ;

  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    var status = res.statusCode;
    res.on('data', function (chunk) {
      response += chunk;
    });
    res.on('end', function () {
      callback(response, status);
    })
  });

  req.on("error", function (err) {
    callback(err.message, null);
  });

  req.write(bridgeData);
  req.end();
}
