function TestLogger() {

}

function TestLoggerChild() {

}

TestLogger.prototype.child = function () {
  return new TestLoggerChild();
};

TestLoggerChild.prototype.info = function (options) {
  return;
};

TestLoggerChild.prototype.trace = function (options) {
  return;
};

module.exports = new TestLogger();
