var
  env  = require('./config.json'),
  wlog = require('winston'),
  ip   = require('ip'),
  argv = require('minimist')(process.argv.slice(2))
;

function port() {
  return argv.p || argv.port || 162;
}

function ipAddress() {
  return ip.address();
}

function environment() {
  var
    argvEnv = argv.E || argv.env,
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
}

function envVars() {
  if (process.env.NODE_ENV) {
    return env[process.env.NODE_ENV];
  } else {
    var node_env = environment();
    return env[node_env];
  }
}

function oids() {
  return env.oids;
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
  var tmpABridge = env.aBridge;
  if (environment() === 'test') tmpABridge.hostname = ip.address();
  return tmpABridge;
}

function sentinel() {
  var tmpSentinel = env.sentinel;
  if (environment() === 'test') {
    tmpSentinel.ip = ip.address();
    tmpSentinel.community = "public";
  }
  return tmpSentinel;
}

module .exports = {
  port:     port(),
  ip:       ipAddress(),
  env:      environment(),
  envVars:  envVars(),
  oids:     oids(),
  bridges:  bridges(),
  aBridge:  aBridge(),
  sentinel: sentinel()
};