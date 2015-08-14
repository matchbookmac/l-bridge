var
  http       = require('http'),
  wlog       = require('winston'),
  aBridge    = require('../config/config').aBridge,
  currentEnv = require('../config/config').env
;

if (currentEnv === 'test') {
  process.stderr.write = wlog.info = function silenceOnTest(args) {
    return;
  };
}

function twoHundred(bridgeData, callback){
  callback();
}

function fourHundred(bridgeData, callback){
  callback();
}

function fourZeroFour(bridgeData, callback){
  callback();
}

function fiveHundred(bridgeData, callback){
  callback();
}

module .exports = {
  "200": twoHundred,
  "400": fourHundred,
  "404": fourZeroFour,
  "500": fiveHundred
};
