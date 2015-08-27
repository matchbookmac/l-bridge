var argv     = require('minimist')(process.argv.slice(2));
var sentinel = require('./mock-sentinel');
var options  = {};

var ip        = argv.i || argv.ip;
var community = argv.c || argv.community;
var oid       = argv.o || argv.oid;
var status    = argv.s || argv.status;

if (ip)        options.ip        = ip;
if (community) options.community = community;
if (oid)       options.oid       = oid;
if (status)    options.status    = status;

sentinel.sendTrap(options);
