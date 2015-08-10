module .exports = (function () {
  var oids = {
    //using oid's as keys for bridgenames
    sentinel: {
      "1.3.6.1.2.1.1.1.0":               "Sentinel 16 is up"
    },
    bridges: {
      "1.3.6.1.4.1.20839.1.2.1.1.1.2.6": "bailey's bridge",
      "1.3.6.1.4.1.20839.1.2.1.1.1.2.5": "cuevas crossing",
      "1.3.6.1.4.1.20839.1.2.1.1.1.2.4": "broadway",
      "1.3.6.1.4.1.20839.1.2.1.1.1.2.3": "burnside",
      "1.3.6.1.4.1.20839.1.2.1.1.1.2.2": "morrison",
      "1.3.6.1.4.1.20839.1.2.1.1.1.2.1": "hawthorne"
    }
  }
  return oids;
})();