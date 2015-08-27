var request = require('request');

var url = "https://hooks.slack.com/services/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";
var slackMsg = {
  channel: "#bridge-test",
  username: "l-bridge",
  text: "This is posted to #bridge-test and comes from a bot named bridgeapp.",
  icon_emoji: ":rotating_light:"
};

var req = request.post(url, {
  form: {
    payload: JSON.stringify(slackMsg)
  }
}, function (err, response) {
    if (err) return console.error(err);
    if (response.body !== 'ok') return console.error(response.body);
});
