module .exports = function(bridgeMessage){

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
    bridgeName = bridgeMessage.bridge;
    console.log(bridgeName);
    bridgeName = bridgeName.replace(/\'/g, "");
    var timeStamp = moment(bridgeMessage.timeStamp).format("YYYY/MM/DD HH:mm:ss").toString();
    console.log(timeStamp);

  connection.connect();



  if (bridgeMessage.status == true){
    var sql = 'INSERT INTO bridgeEvents (trainName, upTime) VALUES (' + "'" + bridgeName + "'" + ', ' + "'" + timeStamp + "'" + ');';
  } else {
    var sql = 'INSERT INTO bridgeEvents (trainName, downTime) VALUES (' + "'" + bridgeName + "'" + ', ' + "'" + timeStamp + "'" + ');';
  };
  console.log(sql);
  connection.query(sql);
}
