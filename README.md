For "deploying" on l-bridge (l-bridge.co.multnomah.or.us)

If starting from scratch:

```console
sudo apt-get nodejs
git clone https://multco.git.beanstalkapp.com/bridgeapp.git
cd bridgeapp
npm install -g forever mocha nodemon jshint
npm install
```

###Start server:

*Production (port 162):*
```console
npm run-script prod-start
```

*Development (port 162):*
```console
npm start
```

###Testing:

####Run test suite:
```console
npm test
```
*Please Note*
The http error handling module uses an exponential backoff to respond to
ECONNREFUSED and 500 errors. Testing this does require the suite to wait for
the backoff cycle to complete. As such, it is not unusual for the test suite
to take ~ 45 s.

####To send a test trap for a bridge:

*Bridge Up*
```console
node modules/send-test-trap.js -s 1
```

*Bridge Down*
```console
node modules/send-test-trap.js -s 0
```

*Options*
```console
-i | --ip        : IP Address for where l-bridge instance is located. Default is
                   the IP address for the current machine.
-c | --community : Community option for SNMP trap. Default is `public`.
-o | --oid       : OID of the trap being sent. Default is
                   `1.3.6.1.4.1.20839.1.2.1.1.1.2.6`, which corresponds to
                   `bailey's bridge` on l-bridge.
-s | --status    : Specify up or down. 1: bridge is raising, 0: bridge is
                   lowering. Default is 0.

Extraneous options with `-` or `--` that are not listed above will be ignored.
```

<!--
  TODO
  When deploying on server, where do we want to store the code?
  When running on the server, how do we want to do that? daemon? root (ick)?
  Do we want the code on the server to follow master in beanstalk with a webhook?

  Code for error checking for http connection refused error
  server.on('error', function (e) {
  if (e.code == 'EADDRINUSE') {
-->
