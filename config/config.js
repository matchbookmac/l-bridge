var ip   = require('ip');
var argv = require('minimist')(process.argv.slice(2));

var currentEnv = (function environment() {
  var
    argvEnv = argv.E || argv.env || process.env.NODE_ENV,
    node_env
  ;
  if (argvEnv === 'production' || argvEnv === 'prod') {
    node_env = process.env.NODE_ENV = 'production';
  } else if (argvEnv === 'dev' || argvEnv === 'development') {
    node_env = process.env.NODE_ENV = 'development';
  } else {
    node_env = process.env.NODE_ENV = 'test';
  }
  return node_env;
})();

var envVars = require('./config.json')[currentEnv];

function port() {
  return argv.p || argv.port || parseInt(process.env.PORT) || 2000;
}

function ipAddress() {
  return ip.address();
}

function oids() {
  return envVars.oids;
}

function bridges() {
  var
    bridgeNames = {},
    bridgeOids  = oids().bridges
  ;
  for (var oid in bridgeOids) {
    if (bridgeOids.hasOwnProperty(oid)) {
      bridgeNames[bridgeOids[oid]] = oid;
    }
  }
  return bridgeNames;
}

function aBridge() {
  return envVars.aBridge;
}

function slack() {
  return envVars.slack;
}

function sentinel() {
  var tmpSentinel = envVars.sentinel;
  return tmpSentinel;
}

module .exports = {
  port:     port(),
  ip:       ipAddress(),
  env:      currentEnv,
  envVars:  envVars,
  oids:     oids(),
  bridges:  bridges(),
  aBridge:  aBridge(),
  slack:    slack(),
  sentinel: sentinel()
};
