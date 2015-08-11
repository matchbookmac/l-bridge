module .exports = function(bridgeData, callback){

  var
    http     = require('http'),
    wlog     = require('winston'),
    ip       = require('ip'),
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
    // response = res;
    // wlog.info('STATUS: ' + res.statusCode);
    res.setEncoding('utf8');
    callback(res, res.statusCode);
// console.log(res.statusCode.toString())

    // res.on('data', function (chunk) {
    //   response += chunk;
    // });
    // res.on('end', function () {
    //   callback(response, res.statusCode.toString());
    // });

  });

  req.on("error", function (err) {
// console.log(err)
    callback(err.message, null);
  });
// console.log(err);
//     error = err;
    // wlog.info("problem with request: " + err.message);
  // });

  req.write(bridgeData);
  req.end();
}
