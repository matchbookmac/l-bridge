## Requirements

- Node.js >= 4.0.0
  - `sudo apt-get nodejs` on ubuntu
- npm >= 2.14.2
- mySQL 5.6
- Redis

## Deployment

For "deploying" on l-bridge (l-bridge.co.multnomah.or.us)

If l-bridge is already configured and has production code:

```console
cd /opt/l-bridge
sudo git pull
sudo chown -R www-data:www-data .
sudo npm i
npm restart
```

If starting from scratch:

```console
cd /opt
git clone https://multco.git.beanstalkapp.com/bridgeapp.git l-bridge
sudo chown -R www-data:www-data l-bridge/
cd l-bridge/
sudo npm install
sudo npm install -g jshint sequelize-cli gulp
```

We are using upstart to run the node server as a daemon in production. Those commands are used for `npm run {start/stop/restart}`.

The upstart file is in `/etc/init/l-bridge.conf`
```shell
#!upstart
# using upstart http://upstart.ubuntu.com/getting-started.html and node forever  https://github.com/nodejitsu/forever/

description "l-bridge node app"
author      "Multnomah County"

start on runlevel [2345]
stop on runlevel [!2345]

respawn
respawn limit 20 5

limit nofile 32768 32768

script
    export HOME="/root"
    chdir /opt/l-bridge
    exec sudo -u www-data PORT=8080 NODE_ENV=production /usr/local/bin/node /opt/l-bridge/index.js >> /opt/l-bridge/logs/app.log 2>&1
end script

pre-start script
    echo "`date -u +%Y-%m-%dT%T.%3NZ`: starting" >> /opt/l-bridge/logs/app.log
end script

pre-stop script
    echo "[`date -u +%Y-%m-%dT%T.%3NZ`]: stopping" >> /opt/l-bridge/logs/app.log
end script
```

### Start server:

*Production:*
```console
sudo start l-bridge
```
or after making changes:
```console
sudo stop l-bridge
sudo start l-bridge
```
OR
```console
npm restart
```

*Development (with jshint and nodemon):*
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
When testing, test-log.md is overwritten so that the test output is silent
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

slack endpoint:
https://hooks.slack.com/services/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

test:
https://hooks.slack.com/services/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
