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

*Also*
When testing, wlog.info is overwritten so that the test output is silent
except for the mocha reporter. If tests are failing and you don't know why,
comment out the lines in post-bridge-message and handle-post-response that
overwrite that function.

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
-b | --bridge    : name of the bridge you are simulating.
-s | --status    : Specify up or down. 1: bridge is raising, 0: bridge is
                   lowering. Default is 0.

Extraneous options with `-` or `--` that are not listed above will be ignored.
```

<!--
  TODO
  When deploying on server, where do we want to store the code?
  When running on the server, how do we want to do that? daemon? root (ick)?
  Do we want the code on the server to follow master in beanstalk with a webhook?
-->
slack endpoint:
https://hooks.slack.com/services/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

test:
https://hooks.slack.com/services/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
