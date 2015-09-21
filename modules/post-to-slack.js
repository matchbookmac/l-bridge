var request    = require('request');
var currentEnv = require('../config/config').env;
var slack      = require('../config/config.json').slack;
var logger     = require('../config/logging');
var _          = require('lodash');

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
        logger.info("[%s] outgoing %s %s - %s",
          response.request.uri.host,
          response.request.method,
          response.request.path,
          response.statusCode
        );
        if (err) return logger.error(err);
        if (response.body !== 'ok') return logger.error(response.body);
    });
  }
};
