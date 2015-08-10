For "deploying" on l-bridge (l-bridge.co.multnomah.or.us)

If starting from scratch:

```console
sudo apt-get nodejs
git clone https://multco.git.beanstalkapp.com/bridgeapp.git
cd bridgeapp
npm install -g forever
```

###Start server:

*Production:*
```console
sudo forever start index.js
```

*Development:*
```console
sudo npm start
```

###Testing:

####Run test suite:
```console
npm test
```

####To send a test trap for a bridge:

*Bridge Up*
```console
node modules/send-test-trap.js 1
```

*Bridge Down*
```console
node modules/send-test-trap.js 0
```
<!--
  TODO
  When deploying on server, where do we want to store the code?
  When running on the server, how do we want to do that? daemon? root (ick)?
  Do we want the code on the server to follow master in beanstalk with a webhook?
-->
