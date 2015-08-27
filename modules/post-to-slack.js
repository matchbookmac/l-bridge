var request = require('request');
var currentEnv = require('../config/config').env;
var slack = require('../config/config.json').slack;

module.exports = function (bridgeData) {
  if (currentEnv !== 'test') {
    var bridgeState = bridgeData.status ? " is starting to lift" : " has reopened";
    var slackText = bridgeData.bridge + bridgeState;
    var slackMsg = {
      channel: slack.channel,
      username: slack.username,
      text: slackText,
      icon_emoji: slack.icon_emoji
    };
    request.post(slack.url, {
      form: {
        payload: JSON.stringify(slackMsg)
      }
    }, function (err, response) {
        if (err) return wlog.error(err);
        if (response.body !== 'ok') return wlog.error(response.body);
    });
  }
};
