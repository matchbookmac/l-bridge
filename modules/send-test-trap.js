var
  argv     = require('minimist')(process.argv.slice(2)),
  sentinel = require('./mock-sentinel'),
  options  = {}
;

var
  ip        = argv.i || argv.ip,
  community = argv.c || argv.community,
  oid       = argv.o || argv.oid,
  status    = argv.s || argv.status
;

if (ip)        options.ip        = ip;
if (community) options.community = community;
if (oid)       options.oid       = oid;
if (status)    options.status    = status;

sentinel.sendTrap(options);
