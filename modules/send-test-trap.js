var argv     = require('minimist')(process.argv.slice(2));
var _        = require('lodash');
var bridges  = _.invert(require('../config/config').bridges);
var sentinel = require('./mock-sentinel');
var options  = {};

var ip        = argv.i || argv.ip;
var community = argv.c || argv.community;
var bridge    = argv.b || argv.bridge;
var status    = argv.s || argv.status;
var oid;

if (bridge) oid = bridges[bridge];
if (ip)        options.ip        = ip;
if (community) options.community = community;
if (oid)       options.oid       = oid;
if (status)    options.status    = status;

sentinel.sendTrap(options);
