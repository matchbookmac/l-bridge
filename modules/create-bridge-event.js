module .exports = function(bridgeMessage){
console.log('foo');
  var
    wlog = require('winston'),
    mysql = require('mysql'),
    moment = require('moment'),
    connection = mysql.createConnection({
      host     : '172.20.144.116',
      user     : 'root',
      password : '',
      port     : 3307,
      database : 'event_schema'
    }),
    bridgeName = bridgeMessage.bridge,
    bridgeName = bridgeName.replace(/\'/g, ""),
    timeStamp = moment(bridgeMessage.timeStamp).format("YYYY/MM/DD HH:mm:ss").toString()
  ;

    connection.connect(function(err){
      if (err) {
        wlog.info("MYSQL connection error: " + err.code)
        wlog.info("MYSQL connection error fatal?: " + err.fatal)
      }
      else{
        wlog.info("MYSQL connection: successful. ")
      }
    });

    if (bridgeMessage.status == false){
      console.log("(false) bridgeMessage.status = " + bridgeMessage.status);
      for (i = 0; i < bridgeOpenings.length; i++){
        //check to see if there are any open bridge events that correspond with this close event
        if (bridgeOpenings[i].name = bridgeName){
          upTime = bridgeOpenings[i].uptime;
          downTime = timeStamp;
          //build sql string
          var sql = 'INSERT INTO bridgeEvents (trainName, upTime, downTime) VALUES (' + "'" + bridgeName + "'" + ', ' + "'" + upTime + "'" + ', ' + "'" + downTime + "'" + ');';
          connection.query(sql);
          bridgeOpenings.splice(i, 1);
        }
      }

    } else if (bridgeMessage.status == true) {
      console.log("(true) bridgeMessage.status = " + bridgeMessage.status);

      var bridgeEvent = {
        name: bridgeName,
        uptime: timeStamp
      }
      //check to see if there are any unclosed bridge openings, if so then delete them and replace with this new bridge opening
      for (i = 0; i < bridgeOpenings.length; i++){
        if(bridgeOpenings[i].name = bridgeName){
          bridgeOpenings.splice(i, 1);
        }
      }
      bridgeOpenings.push(bridgeEvent);
    };
}
